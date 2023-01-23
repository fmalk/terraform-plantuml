export function loadRDS(state, stack, subnet_group, subnet_id, az) {
  const records = state.resources.filter(
    (r) =>
      r.type === 'aws_db_instance' && r.instances[0].attributes.db_subnet_group_name === subnet_group && r.instances[0].attributes.availability_zone === az,
  );

  records.forEach((r, idx) => {
    const att = r.instances[0].attributes;
    let reference = 'AuroraAmazonRDSInstanceIMG';
    switch (att.engine) {
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
    stack.push({
      isGroup: false,
      title: `${att.id}\\n${att.multi_az ? 'multi az' : 'single az'}\\n${att.engine}:${att.engine_version_actual}\\n${att.instance_class}`,
      reference,
      id: `${subnet_id}_${r.instances[0].attributes.id}`,
    });
  });
}
