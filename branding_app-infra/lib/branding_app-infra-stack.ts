import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apiGateway from 'aws-cdk-lib/aws-apigateway'
import * as dotenv from "dotenv"

dotenv.config()
export class BrandingAppInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BrandingAppInfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const layer=new lambda.LayerVersion(this,"BaseLayer",{
      code:lambda.Code.fromAsset("./lambda_base_layer/layer.zip"),
      compatibleRuntimes:[lambda.Runtime.PYTHON_3_11],
    });

    const apiLambda=new lambda.Function(this,"ApiFunction",{
      runtime:lambda.Runtime.PYTHON_3_11,
      code:lambda.Code.fromAsset("../app/"),
      handler:"branding_app_api.handler",
      environment:{
        GROQ_API_KEY:process.env.GROQ_API_KEY??""
      },
      layers:[layer],
    });

    const brandingAppApi=new apiGateway.RestApi(this,"RestApi",{
      restApiName:"brandingApp API"
    });

    const lambdaApiIntegration=new apiGateway.LambdaIntegration(apiLambda);
    brandingAppApi.root.addProxy({
      defaultIntegration:lambdaApiIntegration
    });
  }
}
