import * as EcsClient from "@aws-sdk/client-ecs";

export default class EcsHelper {

  private __client: EcsClient.ECS;

  constructor(awsRegion?: string){
    this.__client = new EcsClient.ECS({
      region: awsRegion ?? "eu-west-2"
    });
  }

  getEcsServices = async (listInput: EcsClient.ListServicesCommandInput) => {
    let res = await this.__client.listServices(listInput);
    return res;
  }

  updateEcsServiceRunCount = async (serviceArn: string, newDesiredCount: number, clusterArn: string) => {
    let res = await this.__client.updateService({
      desiredCount: newDesiredCount,
      service: serviceArn,
      cluster: clusterArn
    });
    return res;
  }
}