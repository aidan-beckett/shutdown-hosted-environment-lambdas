import * as RdsClient from "@aws-sdk/client-rds";

export default class RdsHelper {

  private __client: RdsClient.RDS;
  
  constructor(awsRegion?: string){
    this.__client = new RdsClient.RDS({
      region: awsRegion ?? "eu-west-2"
    });
  }

  getDbInstances = async (describeInput: RdsClient.DescribeDBInstancesCommandInput) => {
    let describeRes = await this.__client.describeDBInstances(describeInput);
    return describeRes;
  }

  startDbInstance = async (instanceName: string) => {
    let startRes = await this.__client.startDBInstance({
      DBInstanceIdentifier: instanceName
    })
    return startRes;
  }

  stopDbInstance = async (instanceName: string) => {
    try{
      let stopRes = await this.__client.stopDBInstance({
        DBInstanceIdentifier: instanceName,
        DBSnapshotIdentifier: `${instanceName}-${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}-${new Date().getHours()}-${new Date().getMinutes()}-nightly-backup`
      });
      return stopRes;
    }
    catch(e) {
      console.log("error");
      console.log(e);
      return null;
    }
  }
}