import { attrSearch, nameSearch } from '../helpers.js';

/**
 * Find every Lambda at this VPC
 *
 * @param {any} state
 * @param {stack} stack
 * @param {string} vpc_id
 * @param {string} subnet_id
 * @returns {string[]} List of Lambda IDs at this VPC
 */
export function loadVPCLambdas(state, stack, vpc_id, subnet_id) {
  // FIXME: find by subnet and vpc_config, missing working example
  const lambdas = attrSearch(state, 'aws_lambda_function', 'vpc_config', (config) => !!config);
  return lambdas.map((lambda) => {
    stack.push({
      isGroup: false,
      title: `Lambda ${nameSearch(lambda)}\\n${lambda.runtime}`,
      reference: 'LambdaLambdaFunctionIMG',
      id: lambda.id,
    });
    return lambda.id;
  });
}

/**
 * Find every Lambda at this Region not belonging to a VPC
 *
 * @param {any} state
 * @param {stack} stack
 * @param {string} region
 * @returns {string[]} List of Lambda IDs at this Region
 */
export function loadLambdas(state, stack, region) {
  const lambdas = attrSearch(state, 'aws_lambda_function', 'arn', (a) => a.indexOf(region) > 0).filter(
    (atts) => !atts.vpc_config || atts.vpc_config.length === 0,
  );
  return lambdas.map((lambda) => {
    stack.push({
      isGroup: false,
      title: `Lambda ${nameSearch(lambda)}\\n${lambda.runtime}`,
      reference: 'LambdaLambdaFunctionIMG',
      id: lambda.id,
    });
    return lambda.id;
  });
}
