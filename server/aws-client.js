// server/aws-client.js - AWS SDK Integration Module
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { IAMClient, ListRolesCommand, GetAccountPasswordPolicyCommand, GetAccountSummaryCommand } from "@aws-sdk/client-iam";
import { EC2Client, DescribeVpcsCommand, DescribeSubnetsCommand, DescribeSecurityGroupsCommand, DescribeVpcEndpointsCommand } from "@aws-sdk/client-ec2";
import { S3Client, ListBucketsCommand, GetBucketEncryptionCommand, GetPublicAccessBlockCommand } from "@aws-sdk/client-s3";
import { KMSClient, ListKeysCommand, ListAliasesCommand, DescribeKeyCommand, GetKeyRotationStatusCommand } from "@aws-sdk/client-kms";
import { CloudTrailClient, DescribeTrailsCommand, GetTrailStatusCommand, LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { ConfigServiceClient, DescribeConfigRulesCommand, DescribeComplianceByConfigRuleCommand, DescribeConfigurationRecordersCommand } from "@aws-sdk/client-config-service";

class AwsServiceManager {
  constructor() {
    this.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      sessionToken: process.env.AWS_SESSION_TOKEN || "",
      region: process.env.AWS_DEFAULT_REGION || "ap-south-1"
    };
    this.isConnected = false;
    this.connectionDetails = null;
    this.lastChecked = null;
    this.connectionError = null;
  }

  getCredentialsConfig() {
    const config = {
      region: this.credentials.region || "ap-south-1"
    };

    if (this.credentials.accessKeyId && this.credentials.secretAccessKey) {
      config.credentials = {
        accessKeyId: this.credentials.accessKeyId,
        secretAccessKey: this.credentials.secretAccessKey,
        ...(this.credentials.sessionToken ? { sessionToken: this.credentials.sessionToken } : {})
      };
    }

    return config;
  }

  async testConnection(newCredentials = null) {
    if (newCredentials) {
      this.credentials = {
        ...this.credentials,
        ...newCredentials
      };
    }

    if (!this.credentials.accessKeyId || !this.credentials.secretAccessKey) {
      this.isConnected = false;
      this.connectionDetails = null;
      this.connectionError = "AWS credentials not provided. Operating in Reference / Demo Mode.";
      return { success: false, error: this.connectionError };
    }

    try {
      const config = this.getCredentialsConfig();
      const sts = new STSClient(config);
      const command = new GetCallerIdentityCommand({});
      const response = await sts.send(command);

      this.isConnected = true;
      this.connectionError = null;
      this.lastChecked = new Date().toISOString();
      this.connectionDetails = {
        accountId: response.Account,
        arn: response.Arn,
        userId: response.UserId,
        region: this.credentials.region
      };

      return {
        success: true,
        details: this.connectionDetails
      };
    } catch (err) {
      this.isConnected = false;
      this.connectionDetails = null;
      this.connectionError = err.message || "Failed to authenticate with AWS";
      return {
        success: false,
        error: this.connectionError
      };
    }
  }

  // Live AWS Fetchers with graceful error handling
  async fetchLiveSecurityData() {
    if (!this.isConnected) {
      return null;
    }

    const config = this.getCredentialsConfig();
    const result = {
      live: true,
      timestamp: new Date().toISOString(),
      account: this.connectionDetails,
      services: {}
    };

    // 1. IAM
    try {
      const iam = new IAMClient(config);
      const rolesRes = await iam.send(new ListRolesCommand({ MaxItems: 20 })).catch(() => ({ Roles: [] }));
      let pwdPolicy = null;
      try {
        pwdPolicy = await iam.send(new GetAccountPasswordPolicyCommand({}));
      } catch (e) {
        pwdPolicy = { notConfigured: true };
      }
      result.services.iam = {
        roles: (rolesRes.Roles || []).map(r => ({
          name: r.RoleName,
          arn: r.Arn,
          createDate: r.CreateDate,
          description: r.Description || "IAM Role"
        })),
        passwordPolicy: pwdPolicy
      };
    } catch (e) {
      result.services.iam = { error: e.message };
    }

    // 2. EC2 & VPC
    try {
      const ec2 = new EC2Client(config);
      const vpcs = await ec2.send(new DescribeVpcsCommand({})).catch(() => ({ Vpcs: [] }));
      const subnets = await ec2.send(new DescribeSubnetsCommand({})).catch(() => ({ Subnets: [] }));
      const sgs = await ec2.send(new DescribeSecurityGroupsCommand({})).catch(() => ({ SecurityGroups: [] }));
      const endpoints = await ec2.send(new DescribeVpcEndpointsCommand({})).catch(() => ({ VpcEndpoints: [] }));

      result.services.network = {
        vpcs: (vpcs.Vpcs || []).map(v => ({
          id: v.VpcId,
          cidr: v.CidrBlock,
          isDefault: v.IsDefault,
          state: v.State
        })),
        subnets: (subnets.Subnets || []).map(s => ({
          id: s.SubnetId,
          vpcId: s.VpcId,
          cidr: s.CidrBlock,
          az: s.AvailabilityZone
        })),
        securityGroups: (sgs.SecurityGroups || []).map(g => ({
          id: g.GroupId,
          name: g.GroupName,
          description: g.Description,
          vpcId: g.VpcId,
          inboundCount: (g.IpPermissions || []).length
        })),
        endpoints: (endpoints.VpcEndpoints || []).map(ep => ({
          id: ep.VpcEndpointId,
          serviceName: ep.ServiceName,
          vpcId: ep.VpcId,
          state: ep.State
        }))
      };
    } catch (e) {
      result.services.network = { error: e.message };
    }

    // 3. S3
    try {
      const s3 = new S3Client(config);
      const bucketsRes = await s3.send(new ListBucketsCommand({})).catch(() => ({ Buckets: [] }));
      const buckets = [];
      for (const b of (bucketsRes.Buckets || []).slice(0, 10)) {
        let isEncrypted = false;
        let publicBlock = null;
        try {
          await s3.send(new GetBucketEncryptionCommand({ Bucket: b.Name }));
          isEncrypted = true;
        } catch (e) {
          isEncrypted = false;
        }
        try {
          const pbRes = await s3.send(new GetPublicAccessBlockCommand({ Bucket: b.Name }));
          publicBlock = pbRes.PublicAccessBlockConfiguration;
        } catch (e) {
          publicBlock = null;
        }
        buckets.push({
          name: b.Name,
          creationDate: b.CreationDate,
          encrypted: isEncrypted,
          publicAccessBlock: publicBlock
        });
      }
      result.services.s3 = { buckets };
    } catch (e) {
      result.services.s3 = { error: e.message };
    }

    // 4. KMS
    try {
      const kms = new KMSClient(config);
      const keysRes = await kms.send(new ListKeysCommand({ Limit: 10 })).catch(() => ({ Keys: [] }));
      const aliasesRes = await kms.send(new ListAliasesCommand({ Limit: 20 })).catch(() => ({ Aliases: [] }));
      result.services.kms = {
        keyCount: (keysRes.Keys || []).length,
        aliases: (aliasesRes.Aliases || []).map(a => ({
          aliasName: a.AliasName,
          targetKeyId: a.TargetKeyId
        }))
      };
    } catch (e) {
      result.services.kms = { error: e.message };
    }

    // 5. CloudTrail
    try {
      const trail = new CloudTrailClient(config);
      const trailsRes = await trail.send(new DescribeTrailsCommand({})).catch(() => ({ trailList: [] }));
      const eventsRes = await trail.send(new LookupEventsCommand({ MaxResults: 10 })).catch(() => ({ Events: [] }));
      result.services.cloudtrail = {
        trails: trailsRes.trailList || [],
        recentEvents: (eventsRes.Events || []).map(ev => ({
          id: ev.EventId,
          name: ev.EventName,
          time: ev.EventTime,
          username: ev.Username,
          resource: (ev.Resources || []).map(r => r.ResourceName).join(", ")
        }))
      };
    } catch (e) {
      result.services.cloudtrail = { error: e.message };
    }

    // 6. AWS Config
    try {
      const cfg = new ConfigServiceClient(config);
      const rulesRes = await cfg.send(new DescribeConfigRulesCommand({})).catch(() => ({ ConfigRules: [] }));
      const compRes = await cfg.send(new DescribeComplianceByConfigRuleCommand({})).catch(() => ({ ComplianceByConfigRules: [] }));
      result.services.config = {
        rules: rulesRes.ConfigRules || [],
        compliance: compRes.ComplianceByConfigRules || []
      };
    } catch (e) {
      result.services.config = { error: e.message };
    }

    return result;
  }
}

export const awsManager = new AwsServiceManager();
