import { attrSearch, nameSearch } from '../helpers.js';

export function loadRDS(state, stack, subnet_group, subnet_id, az) {
  const dbs = attrSearch(state, 'aws_db_instance', 'db_subnet_group_name', subnet_group).filter((db) => db.availability_zone === az);
  dbs.forEach((db) => {
    let reference = 'AuroraAmazonRDSInstanceIMG';
    switch (db.engine) {
      case 'postgres':
        reference = 'AuroraPostgreSQLInstanceIMG';
        break;
      case 'sqlserver':
        reference = 'AuroraSQLServerInstanceIMG';
        break;
      case 'oracle':
        reference = 'AuroraOracleInstanceIMG';
        break;
      case 'mysql':
        reference = 'AuroraMySQLInstanceIMG';
        break;
      case 'mariadb':
        reference = 'AuroraMariaDBInstanceIMG';
        break;
    }
    let title = nameSearch(db);
    stack.push({
      isGroup: false,
      title: `${title}\\n${db.multi_az ? 'multi az' : 'single az'}\\n${db.engine}:${db.engine_version_actual}\\n${db.instance_class}`,
      reference,
      id: `${subnet_id}_${db.id}`,
    });
  });
}
