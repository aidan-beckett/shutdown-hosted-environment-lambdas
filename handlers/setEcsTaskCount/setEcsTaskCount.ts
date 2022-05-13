import EcsHelper from "/opt/nodejs/aws/ecs";
import { sleep } from "/opt/nodejs/sleep";

export const handler = async (event: any) => {
  console.log(event);
  let ecsHelper = new EcsHelper()
  let serviceArnRes = await ecsHelper.getEcsServices({
    cluster: event.body.clusterArn,
  });
  let serviceArns: string[] = [];

  if(serviceArnRes.serviceArns) {
    serviceArns = serviceArns.concat(serviceArnRes.serviceArns);
  }
  do {
    serviceArnRes = await ecsHelper.getEcsServices({
      cluster: event.body.clusterArn,
      nextToken: serviceArnRes.nextToken
    });

    if(serviceArnRes.serviceArns) {
      serviceArns = serviceArns.concat(serviceArnRes.serviceArns);
    }
  } while(serviceArnRes.nextToken)

  let filteredArns = serviceArns.filter((arn) => arn.includes("uat-service") || arn.includes("staging-service"));
  for(let arn of filteredArns){
    let res = await ecsHelper.updateEcsServiceRunCount(arn, event.body.newCount, event.body.clusterArn).catch(e => console.log(e));
  };
  return {
    statusCode: 200,
    body:"{message: `done`}"
  }
}
