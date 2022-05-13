import RdsHelper from "/opt/nodejs/aws/rds";

export const handler = async (event: any) => {
  let rdsHelper = new RdsHelper();
  let dbInstancesRes = await rdsHelper.getDbInstances({});
  let dbInstances = dbInstancesRes.DBInstances;
  do{
    dbInstancesRes = await rdsHelper.getDbInstances({
      Marker: dbInstancesRes.Marker
    });
    if(dbInstancesRes.DBInstances){
      dbInstances ? dbInstances = dbInstances.concat(dbInstancesRes.DBInstances) : dbInstances = dbInstancesRes.DBInstances
    }
  } while(dbInstancesRes.Marker)

  if(dbInstances){
    let filteredDBInstances = dbInstances.filter(db => (db.DBInstanceIdentifier?.includes("-staging") || db.DBInstanceIdentifier?.includes("-uat")) && db.DBInstanceIdentifier !== "synextra-db-synextra-website-staging");
    console.log(filteredDBInstances)
    for(let db of filteredDBInstances){
      if(db.DBInstanceIdentifier) {
        await rdsHelper.stopDbInstance(db.DBInstanceIdentifier);
      }
    };
    return {
      statusCode: 200,
      body: "{message:`DBs Stopped`}" 
    };
  }
  return {
    statusCode: 404,
    body: "{message: `No DBs Found`}"
  }
}