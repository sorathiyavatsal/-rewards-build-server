import Sequelize from 'sequelize';
import {
    sequelize
} from '../database/config';

export const CompanyModel = sequelize.define( 'company', {
    company_name: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING( 255 ),
        unique: true,
        validate: {
            isEmail: true
        },
        allowNull: false
    },
    password: {
        type: Sequelize.STRING( 50 ),
        allowNull: false
    },
    stripeId: {
        type: Sequelize.STRING( 256 ),
        allowNull: true
    },
    stripeSourceId: {
        type: Sequelize.STRING( 256 ),
        allowNull: true
    },
    token: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    balance: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
    }
}, {
    timestamps: true
} );

export const CustomerModel = sequelize.define( 'customer', {
    first_name: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING( 255 ),
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
}, {
    timestamps: true
} )

export const RetailerModel = sequelize.define( 'retailer', {
    retailer_name: {
        type: Sequelize.STRING( 255 ),
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER( 1 ),
        defaultValue: 1,
        allowNull: false
    },
    logo: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
} )

export const RewardModel = sequelize.define( 'reward', {
    reward_name: {
        type: Sequelize.STRING( 256 ),
        allowNull: false
    },
    reward_detail: {
        type: Sequelize.STRING( 256 ),
        allowNull: false
    },
    reward_description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    reward_terms: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    product_price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    tax_percent: {
        type: Sequelize.INTEGER( 13 ),
        allowNull: false
    },
    product_image: {
        type: Sequelize.STRING( 256 ),
        allowNull: true
    },
    status: {
        type: Sequelize.INTEGER( 1 ),
        defaultValue: 0
    },
    delete_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    start_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    end_date: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    timestamps: true
} );

export const RewardsCompanyModel = sequelize.define( 'reward_company', {
    reward_name: {
        type: Sequelize.STRING( 256 ),
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER( 11 ),
        allowNull: true
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    tax: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    total: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    purchase_date: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    timestamps: true
} );

export const RewardsLocationModel = sequelize.define( 'reward_location', {
    location_name: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    location_address: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    latitude: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    longitude: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER( 1 ),
        defaultValue: 0
    }
}, {
    timestamps: true
} );

export const RewardsVoucherModel = sequelize.define( 'rewards_voucher', {
    name: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING( 255 ),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    reward_code: {
        type: Sequelize.BIGINT( 20 ),
        allowNull: true
    },
    validity_start: {
        type: Sequelize.DATE,
        allowNull: true
    },
    validity_end: {
        type: Sequelize.DATE,
        allowNull: true
    },
    status: {
        type: Sequelize.INTEGER( 1 ),
        defaultValue: 0
    }
}, {
    timestamps: true
} );

export const UserModel = sequelize.define( 'user', {
    first_name: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING( 111 ),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING( 50 ),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING( 255 ),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    token: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    company_id: {
        type: Sequelize.INTEGER( 11 ),
        allowNull: true
    },
    retailer_id: {
        type: Sequelize.INTEGER( 11 ),
        allowNull: true
    }
}, {
    timestamps: true
} );

RewardsLocationModel.belongsTo( RewardModel, {
    foreignKey: 'reward_id'
} );

RewardsCompanyModel.belongsTo( CompanyModel, {
    foreignKey: 'company_id'
} );

RewardsCompanyModel.belongsTo( RewardModel, {
    foreignKey: 'reward_id'
} );

RewardsVoucherModel.belongsTo( CompanyModel, {
    foreignKey: 'company_id'
} );

RewardsVoucherModel.belongsTo( RewardModel, {
    foreignKey: 'reward_id'
} );

RewardModel.belongsTo( RetailerModel, {
    foreignKey: 'retailer_id'
} );


// sequelize.sync( { force: true } ).then( resp => {
//     console.log( { resp } )
// } );
