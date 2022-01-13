# DB Changes

## 20th September 2018 - Completed
```
ALTER TABLE `laboursquare_db`.`ls_job_logs` 
ADD COLUMN `type` VARCHAR(45) NULL AFTER `description`;
```

```
ALTER TABLE `laboursquare_db`.`ls_users` 
CHANGE COLUMN `cnicurl` `cnicbackurl` VARCHAR(255) NULL DEFAULT NULL ,
ADD COLUMN `cnicfronturl` VARCHAR(255) NULL AFTER `cnicbackurl`;

```

## 21st September 2018 - Completed

```
ALTER TABLE `laboursquare_db`.`ls_users` 
CHANGE COLUMN `dob` `idcardno` VARCHAR(255) NULL DEFAULT NULL ,
ADD COLUMN `cityid` INT(11) NULL AFTER `firebasetoken`,
ADD COLUMN `stateid` INT(11) NULL AFTER `cityid`,
ADD COLUMN `countryid` INT(11) NULL AFTER `stateid`,
ADD INDEX `FK_COUNTRY_idx` (`countryid` ASC),
ADD INDEX `FK_STATE_idx` (`stateid` ASC),
ADD INDEX `FK_CITY_idx` (`cityid` ASC);
ALTER TABLE `laboursquare_db`.`ls_users` 
ADD CONSTRAINT `FK_COUNTRY`
  FOREIGN KEY (`countryid`)
  REFERENCES `laboursquare_db`.`ls_countries` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_STATE`
  FOREIGN KEY (`stateid`)
  REFERENCES `laboursquare_db`.`ls_states` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_CITY`
  FOREIGN KEY (`cityid`)
  REFERENCES `laboursquare_db`.`ls_cities` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

```

### 26th September 2018 - Pending

```
ALTER TABLE `laboursquare_db`.`ls_users` 
ADD UNIQUE INDEX `mobile_UNIQUE` (`mobile` ASC);

ALTER TABLE `laboursquare_db`.`ls_users` 
ADD COLUMN `verificationnumber` VARCHAR(45) NULL AFTER `countryid`,
ADD COLUMN `numberverify` ENUM('pending', 'approved') NULL AFTER `verificationnumber`,
ADD COLUMN `islogin` TINYINT NULL DEFAULT 0 AFTER `numberverify`,
ADD UNIQUE INDEX `mobile_UNIQUE` (`mobile` ASC);
```

### 1st October 2018 - Pending

```
ALTER TABLE `laboursquare_db`.`ls_job_assets` 
DROP FOREIGN KEY `ls_job_assets_ibfk_1`;
ALTER TABLE `laboursquare_db`.`ls_job_assets` 
CHANGE COLUMN `jobId` `phaseId` INT(11) NULL DEFAULT NULL ,
ADD INDEX `ls_job_assets_ibfk_1_idx` (`phaseId` ASC),
DROP INDEX `jobId` ;
ALTER TABLE `laboursquare_db`.`ls_job_assets` 
ADD CONSTRAINT `ls_job_assets_ibfk_1`
  FOREIGN KEY (`phaseId`)
  REFERENCES `laboursquare_db`.`ls_job_phases` (`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
```

```
ALTER TABLE `laboursquare_db`.`ls_countries` 
ADD COLUMN `isactive` TINYINT NULL DEFAULT 0 AFTER `updatedAt`;
```