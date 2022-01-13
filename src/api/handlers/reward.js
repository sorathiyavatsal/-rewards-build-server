import { CompanyModel, CustomerModel, RewardModel, RewardsCompanyModel, RewardsLocationModel, RewardsVoucherModel } from '../../models';
import {
    generateRandomNumber,
    generateResponse, parseBody
} from '../../utilities/index';
import { getRedeemRewardTemplate, sendEmail } from '../../utilities/mailer';

export async function addReward(req, res) {
    const {
        reward_name,
        reward_detail,
        reward_description,
        reward_terms,
        product_price,
        tax_percent,
        start_date,
        end_date,
        delete_date,
        status
    } = parseBody(req);

    const reward = await RewardModel.find({ where: { reward_name } });

    if (reward) {
        generateResponse(400, `Reward with name ${reward_name} already exists.`, {}, res);
    } else {
        const response = await RewardModel.create({
            reward_name,
            reward_detail,
            reward_description,
            reward_terms,
            product_price,
            tax_percent,
            product_image: req.file ? req.file.filename : undefined,
            start_date,
            end_date,
            delete_date,
            status
        });
        generateResponse(201, 'Reward added!', response, res);
    }
}

export async function updateReward(req, res) {
    const {
        reward_detail,
        reward_description,
        reward_terms,
        product_price,
        tax_percent,
        product_image,
        start_date,
        end_date,
        delete_date,
        status,
        id
    } = parseBody(req);

    const reward = await RewardModel.find({ where: { id } });

    if (reward) {
        await RewardModel.update({
            reward_detail,
            reward_description,
            reward_terms,
            product_price,
            tax_percent,
            product_image,
            start_date,
            end_date,
            delete_date,
            status
        }, { where: { id } });
        generateResponse(200, 'Reward updated!', {}, res);
    } else {
        generateResponse(404, `Reward with id ${id} not found.`, {}, res);
    }
}

export async function getAllRewards(req, res) {
    const rewards = await RewardModel.findAll();

    generateResponse(200, 'Rewards fetched', rewards, res);
}

export async function getAllRewardDetails(req, res) {
    const { id } = req.params;

    const rewardDetails = await RewardModel.find({ where: { id } });

    if (rewardDetails) {
        generateResponse(200, 'Reward details fetched', rewardDetails, res);
    } else {
        generateResponse(404, `Reward with id ${id} not found.`, {}, res);
    }
}

export async function deleteReward(req, res) {
    const { id } = parseBody(req);

    const reward = await RewardModel.find({ where: { id } });

    if (reward) {
        await RewardModel.destroy({ where: { id } });

        generateResponse(200, 'Reward removed!', {}, res);
    } else {
        generateResponse(404, `Reward with id ${id} not found.`, {}, res);
    }
}

export async function loadReward(req, res) {
    const { id: company_id } = req.user;

    const {
        reward_id,
        quantity,
        reward_name
    } = parseBody(req);

    try {
        const reward = await RewardModel.find({ where: { id: reward_id } });

        if (!reward) {
            throw new Error(`Reward with id ${reward_id} not found.`);
        }

        const company = await CompanyModel.find({ where: { id: company_id } });

        if (!company) {
            throw new Error(`Company with id ${company_id} not found.`);
        }

        if (quantity <= 0) {
            throw new Error(`Quantity should be greater than 0`);
        }

        const balance = parseInt( company.balance );

        const isRewardAlreadyExists = await RewardsCompanyModel.find({ where: { reward_id, company_id } });

        if (isRewardAlreadyExists) {
            const totalQuantity = parseInt(isRewardAlreadyExists.quantity) + parseInt(quantity);
            const totalPrice = totalQuantity * parseFloat(isRewardAlreadyExists.price);
            const tax = parseFloat(isRewardAlreadyExists.tax) / 100;

            if ( ( totalPrice - ( totalPrice * tax ) ) < balance )
            {
                const updatedBalance = parseFloat( company.balance ) - parseFloat( totalPrice - ( totalPrice * tax ) )

                await CompanyModel.update( { balance: updatedBalance }, { where: { id: company_id } } );

                await RewardsCompanyModel.update( {
                    quantity: totalQuantity,
                    total: totalPrice - ( totalPrice * tax ),
                }, { where: { id: isRewardAlreadyExists.id } } );

                return generateResponse(200,'Reward loaded!' , {}, res);
            } else
            {
                generateResponse( 400, 'Not enough balance to load a reward!', {}, res );
            } 
        } else {
            const { tax_percent, product_price } = reward;

            const totalPrice = parseFloat( quantity ) * parseFloat( product_price );
            const tax = parseFloat( tax_percent ) / 100;
            let loadRewardObject = {}
            
            if ( ( totalPrice - ( totalPrice * tax ) ) < balance )
            {
                loadRewardObject = {
                    reward_name,
                    quantity,
                    price: product_price,
                    tax: tax_percent,
                    total: totalPrice - ( totalPrice * tax ),
                    purchase_date: new Date(),
                    reward_id,
                    company_id
                }

                const updatedBalance = parseFloat( company.balance ) - parseFloat( totalPrice - ( totalPrice * tax ) )

                await CompanyModel.update( { balance: updatedBalance }, { where: { id: company_id } } );

                await RewardsCompanyModel.create( loadRewardObject );
                generateResponse( 200, 'Reward loaded!', {}, res );
            } else
            {
                generateResponse( 400, 'Not enough balance to load a reward!', {}, res );
            }

            /* await buyReward(totalPrice - (totalPrice * tax)) */
            await RewardsCompanyModel.create(loadRewardObject);
            generateResponse(200, 'Reward loaded!', {}, res);
            /* } else {
                generateResponse(400, 'Not enough balance to load a reward!', {}, res);
            } */
        }

    } catch (ex) {
        console.log(ex)
        generateResponse(400, ex.message, {}, res)
    }

}

export async function fetchCompanyRewards(req, res) {
    const { id: company_id } = req.user;

    console.log(company_id)

    const comapnyRewards = await RewardsCompanyModel.findAll({ where: { company_id } });

    console.log(comapnyRewards)

    for (const comapnyReward of comapnyRewards) {
        const reward = await RewardModel.find({ where: { id: comapnyReward.reward_id }, raw: true });
        comapnyReward.reward_id = reward;
    }

    generateResponse(200, 'Rewards fetched', comapnyRewards, res);
}

export async function sendReward(req, res) {
    const { id: company_id } = req.user;
    const {
        first_name,
        last_name,
        email,
        validity_end,
        reward_id
    } = parseBody(req);

    try {
        const reward = await RewardModel.find({ where: { id: reward_id } });

        if (!reward) {
            throw new Error(`Reward with id ${reward_id} not found.`);
        }

        const company = await CompanyModel.find({ where: { id: company_id } });

        if (!company) {
            throw new Error(`Company with id ${company_id} not found.`);
        }

        const companyReward = await RewardsCompanyModel.find({ where: { company_id, reward_id } });

        if (companyReward) {
            if (companyReward.quantity > 0) {
                const rewardVoucher = await RewardsVoucherModel.create({
                    name: `${first_name} ${last_name}`,
                    email,
                    reward_code: generateRandomNumber(8),
                    validity_start: new Date(),
                    validity_end,
                    company_id,
                    reward_id,
                    status: 1
                });

                if (rewardVoucher) {
                    const totalQuantity = parseInt(companyReward.quantity) - 1;
                    const totalPrice = totalQuantity * parseFloat(companyReward.price);
                    const tax = parseFloat(companyReward.tax) / 100;

                    await RewardsCompanyModel.update({
                        quantity: totalQuantity,
                        total: totalPrice - (totalPrice * tax),
                    }, { where: { id: companyReward.id } });

                    const isCustomerExists = await CustomerModel.find({ where: { email } });
                    if (!isCustomerExists) {
                        await CustomerModel.create({
                            first_name,
                            last_name,
                            email
                        });
                    }

                    const rewardLocations = await RewardsLocationModel.findAll( { where: { reward_id } } ) || [];

                    const mailTemplate = getRedeemRewardTemplate( company, reward, rewardLocations.map( item => `${ item.location_name } (${ item.location_address })` ), rewardVoucher.validity_end );

                    sendEmail( {
                        to: email,
                        subject: `You have received a reward from ${ company.company_name }`,
                        body: mailTemplate
                    } );

                    generateResponse( 200, 'Reward sent successfully', {}, res );
                }
            } else {
                generateResponse(400, `You don't have enough rewards to send, kindly load some.`, {}, res);
            }
        } else {
            generateResponse(400, `You don't have enough rewards to send, kindly load some.`, {}, res);
        }

    } catch (ex) {
        generateResponse(400, ex.message, {}, res)
    }
}

export async function fetchSentRewards(req, res) {
    const { id: company_id } = req.user;

    const vouchers = await RewardsVoucherModel.findAll({ where: { company_id } });

    for (const voucher of vouchers) {
        const reward = await RewardModel.find({ where: { id: voucher.reward_id }, raw: true });
        voucher.reward_id = reward;
    }

    generateResponse(200, 'Rewards fetched', vouchers, res);
}

export async function redeemReward(req, res) {
    const { code } = parseBody(req);

    const voucher = await RewardsVoucherModel.find({ where: { reward_code: code } });

    if (voucher) {
        const expiry = voucher.validity_end;

        const currentTimestamp = (new Date()).getTime();
        const expiryTimestamp = (new Date(expiry)).getTime();

        if (currentTimestamp >= expiryTimestamp) {
            generateResponse(400, 'Reward expired', {}, res);
        } else {
            if (voucher.status != 1) {
                generateResponse(400, 'Reward already redeemed', {}, res);
            } else {
                await RewardsVoucherModel.update({
                    status: 2
                }, {
                    where: {
                        id: voucher.id
                    }
                });

                generateResponse(200, 'Rewards redeemed', {}, res);
            }
        }
    } else {
        generateResponse(400, 'Invlaid code', {}, res);
    }
}