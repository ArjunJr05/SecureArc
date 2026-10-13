// mock-data.js - Reference dataset from the SecureArch Project Report
// Project: A Secure and Compliant Cloud Architecture on AWS Using Defence-in-Depth
// Author: Arjun D (23UAI015), Department of AI & Data Science, SMVEC

export const referenceDataset = {
  accountInfo: {
    accountId: "123456789012",
    accountAlias: "secure-arch-prod",
    arn: "arn:aws:iam::123456789012:role/SecureArchAdmin",
    userId: "AROA123456789EXAMPLE:arjun",
    projectOwner: "Arjun",
    registerNumber: "23UAI015",
    collegeEmail: "btechaids23210@smvec.ac.in",
    department: "Artificial Intelligence and Data Science",
    institution: "Sri Manakula Vinayagar Engineering College (SMVEC)",
    selectedRegion: "ap-south-1",
    availableRegions: [
      { id: "ap-south-1", name: "Mumbai (ap-south-1)", default: true },
      { id: "us-east-1", name: "US East - N. Virginia (us-east-1)" },
      { id: "us-west-2", name: "US West - Oregon (us-west-2)" },
      { id: "eu-west-1", name: "Europe - Ireland (eu-west-1)" }
    ],
    lastUpdated: "12 Oct 2026, 07:48 PM"
  },

  overviewMetrics: {
    overallPosture: "Good",
    postureScore: 78,
    postureScoreMax: 100,
    criticalFindings: 3,
    criticalChange: "+1 from last week",
    highSeverityFindings: 8,
    highChange: "-4 from last week",
    complianceRate: 87,
    complianceChange: "+5% from last month",
    encryptedStorageRatio: "12 / 14",
    encryptedStorageLabel: "SSE-KMS enabled",
    cloudTrailStatus: "Active",
    cloudTrailLabel: "Multi-Region Trail",

    findingsBySeverity: {
      total: 24,
      breakdown: [
        { severity: "Critical", count: 3, percentage: 12, color: "#EF4444" },
        { severity: "High", count: 8, percentage: 33, color: "#F97316" },
        { severity: "Medium", count: 9, percentage: 38, color: "#FBBF24" },
        { severity: "Low", count: 4, percentage: 17, color: "#3B82F6" }
      ]
    },

    complianceOverTime: [
      { date: "Sep 13", rate: 50 },
      { date: "Sep 20", rate: 60 },
      { date: "Sep 27", rate: 58 },
      { date: "Oct 04", rate: 70 },
      { date: "Oct 11", rate: 87 }
    ],

    findingsByService: [
      { service: "S3", count: 8, color: "#EF4444" },
      { service: "IAM", count: 5, color: "#F97316" },
      { service: "EC2", count: 4, color: "#FBBF24" },
      { service: "VPC", count: 3, color: "#60A5FA" },
      { service: "RDS", count: 2, color: "#A855F7" },
      { service: "KMS", count: 2, color: "#10B981" }
    ],

    quickStats: {
      iamPermissionRisks: {
        count: 2,
        label: "Roles with excessive permissions",
        roles: ["SecureArchAdmin", "SecureArchAppRole"]
      },
      encryptionCoverage: {
        percentage: 86,
        label: "Encrypted storage resources",
        detail: "12 / 14 resources use SSE-KMS"
      },
      awsConfigCompliance: {
        percentage: 87,
        label: "Resources compliant",
        detail: "74 / 85 resources"
      },
      recommendedActions: {
        count: 5,
        label: "High priority remediation actions",
        items: [
          { text: "Enable encryption for S3 bucket (CFG-001)", color: "#EF4444" },
          { text: "Restrict IAM admin access (IAM-002)", color: "#EF4444" },
          { text: "Update security group rules (EC2-003)", color: "#FBBF24" }
        ]
      }
    }
  },

  recentAuditActivity: [
    {
      id: "evt-001",
      event: "ConsoleLogin",
      iconType: "login",
      details: "Successful console login for user",
      user: "arjun-admin",
      time: "12 Oct 2026, 07:32 PM",
      region: "ap-south-1",
      status: "Success",
      sourceIP: "203.192.12.44",
      mfaUsed: "Yes (Virtual MFA)"
    },
    {
      id: "evt-002",
      event: "PutBucketPolicy",
      iconType: "s3",
      details: "S3 bucket policy updated",
      user: "SecureArchAdmin",
      time: "12 Oct 2026, 06:18 PM",
      region: "ap-south-1",
      status: "Success",
      resource: "arn:aws:s3:::secure-arch-data",
      actionResult: "Enforced TLS 1.2+ & Deny unencrypted uploads"
    },
    {
      id: "evt-003",
      event: "AuthorizeSecurityGroupIngress",
      iconType: "network",
      details: "Security group rule modified",
      user: "SecureArchAdmin",
      time: "12 Oct 2026, 04:51 PM",
      region: "ap-south-1",
      status: "Success",
      resource: "sg-0123456789abcdef0 (ALB-SG)",
      actionResult: "Restricted port 443 only from 0.0.0.0/0"
    },
    {
      id: "evt-004",
      event: "CreateRole",
      iconType: "iam",
      details: "IAM role created: SecureArchAppRole",
      user: "SecureArchAdmin",
      time: "12 Oct 2026, 02:14 PM",
      region: "ap-south-1",
      status: "Success",
      resource: "arn:aws:iam::123456789012:role/SecureArchAppRole",
      actionResult: "Attached least-privilege policy + KMS key ARN"
    },
    {
      id: "evt-005",
      event: "Config Configuration Change",
      iconType: "config",
      details: "Configuration change detected",
      user: "AWSConfigService",
      time: "12 Oct 2026, 11:28 AM",
      region: "ap-south-1",
      status: "Recorded",
      resource: "AWS::EC2::SecurityGroup",
      actionResult: "Evaluated rule restricted-ssh -> COMPLIANT"
    },
    {
      id: "evt-006",
      event: "KmsGenerateDataKey",
      iconType: "kms",
      details: "Cryptographic data key generated",
      user: "SecureArchAppRole",
      time: "12 Oct 2026, 10:15 AM",
      region: "ap-south-1",
      status: "Success",
      resource: "arn:aws:kms:ap-south-1:123456789012:key/alias/secure-arch-data",
      actionResult: "S3 envelope encryption session"
    }
  ],

  recentFindings: [
    {
      id: "CFG-001",
      title: "S3 bucket without encryption",
      severity: "Critical",
      service: "S3",
      detectedTime: "12 Oct 2026, 06:18 PM",
      status: "Open",
      resource: "arn:aws:s3:::secure-arch-data-temp",
      rule: "s3-bucket-server-side-encryption-enabled",
      remediationId: "REM-001",
      remediationAvailable: true,
      description: "S3 bucket secure-arch-data-temp does not enforce server-side encryption with AWS KMS.",
      remediationPlan: "Enable SSE-KMS using customer managed key alias/secure-arch-data and enable Bucket Key."
    },
    {
      id: "IAM-002",
      title: "IAM user with admin privileges",
      severity: "High",
      service: "IAM",
      detectedTime: "12 Oct 2026, 03:45 PM",
      status: "Under Review",
      resource: "arn:aws:iam::123456789012:user/temp-developer",
      rule: "iam-user-no-admin-policy",
      remediationId: "REM-002",
      remediationAvailable: true,
      description: "Direct IAM user has AdministratorAccess without MFA or permission boundary.",
      remediationPlan: "Migrate human credentials to IAM Identity Center with temporary STS tokens and attach permission boundary."
    },
    {
      id: "EC2-003",
      title: "Security group allows 0.0.0.0/0",
      severity: "High",
      service: "EC2",
      detectedTime: "12 Oct 2026, 01:22 PM",
      status: "Remediation Pending",
      resource: "sg-0a8b9c7d1e2f3a4b5 (app-test-sg)",
      rule: "restricted-ssh",
      remediationId: "REM-003",
      remediationAvailable: true,
      description: "Inbound SSH port 22 is exposed to 0.0.0.0/0 on test instance security group.",
      remediationPlan: "Revoke port 22 ingress rule; enforce management via AWS Systems Manager Session Manager."
    },
    {
      id: "KMS-004",
      title: "KMS key rotation disabled",
      severity: "Medium",
      service: "KMS",
      detectedTime: "11 Oct 2026, 11:10 PM",
      status: "Open",
      resource: "arn:aws:kms:ap-south-1:123456789012:key/b8a2c4e6-test",
      rule: "cmk-backing-key-rotation-enabled",
      remediationId: "REM-004",
      remediationAvailable: true,
      description: "Customer managed key does not have automatic 365-day rotation activated.",
      remediationPlan: "Enable automatic annual key rotation via KMS API or AWS Management Console."
    },
    {
      id: "RDS-005",
      title: "RDS instance not encrypted",
      severity: "Medium",
      service: "RDS",
      detectedTime: "11 Oct 2026, 09:14 PM",
      status: "Accepted Risk",
      resource: "arn:aws:rds:ap-south-1:123456789012:db:test-replica",
      rule: "rds-storage-encrypted",
      remediationId: "REM-005",
      remediationAvailable: false,
      description: "Development read-replica lacks KMS CMK storage encryption. Scheduled for decommissioning.",
      remediationPlan: "Take snapshot, copy with KMS encryption enabled, and replace instance."
    },
    {
      id: "S3-006",
      title: "S3 bucket public read access prohibited",
      severity: "Critical",
      service: "S3",
      detectedTime: "11 Oct 2026, 04:30 PM",
      status: "Remediated",
      resource: "arn:aws:s3:::secure-arch-staging-bucket",
      rule: "s3-bucket-public-read-prohibited",
      remediationId: "REM-006",
      remediationAvailable: true,
      description: "Test bucket had public read ACL enabled.",
      remediationPlan: "SSM Automation runbook applied: All 4 S3 Block Public Access controls enforced."
    },
    {
      id: "VPC-007",
      title: "VPC Flow Logs not enabled on secondary VPC",
      severity: "Medium",
      service: "VPC",
      detectedTime: "10 Oct 2026, 02:11 PM",
      status: "Remediated",
      resource: "vpc-0987654321fedcba0",
      rule: "vpc-flow-logs-enabled",
      remediationId: "REM-007",
      remediationAvailable: true,
      description: "Secondary dev VPC lacked Flow Logs delivery.",
      remediationPlan: "Created Flow Logs stream targeting CloudWatch Logs group /aws/vpc/flowlogs."
    },
    {
      id: "IAM-008",
      title: "Password policy does not enforce 14-character minimum",
      severity: "High",
      service: "IAM",
      detectedTime: "09 Oct 2026, 11:00 AM",
      status: "Remediated",
      resource: "arn:aws:iam::123456789012:account-password-policy",
      rule: "iam-password-policy",
      remediationId: "REM-008",
      remediationAvailable: true,
      description: "Account password policy lacked 90-day expiry and 24-password history.",
      remediationPlan: "Applied CIS Benchmark IAM password policy baseline."
    }
  ],

  // Full Documented Risk Register (10 Risks from Section 4.4.1 Step 3)
  riskRegister: [
    {
      no: 1,
      riskId: "RSK-001",
      risk: "Root account without MFA or with access keys",
      severity: "Critical",
      remediation: "Enable MFA, delete keys, alert on root login",
      controlService: "IAM, CloudTrail",
      status: "Remediated",
      verified: true
    },
    {
      no: 2,
      riskId: "RSK-002",
      risk: "IAM user with console access and no MFA",
      severity: "High",
      remediation: "Move to Identity Center; enforce MFA",
      controlService: "IAM, Config",
      status: "Under Review",
      verified: false
    },
    {
      no: 3,
      riskId: "RSK-003",
      risk: "Over-permissive IAM policy using wildcards",
      severity: "High",
      remediation: "Rewrite least privilege; validate with Access Analyzer",
      controlService: "IAM",
      status: "Remediated",
      verified: true
    },
    {
      no: 4,
      riskId: "RSK-004",
      risk: "Security group open to 0.0.0.0/0 on SSH",
      severity: "High",
      remediation: "Remove rule; use Session Manager",
      controlService: "VPC, SSM",
      status: "Remediation Pending",
      verified: false
    },
    {
      no: 5,
      riskId: "RSK-005",
      risk: "S3 bucket allowing public access",
      severity: "Critical",
      remediation: "Enable Block Public Access; auto-remediate",
      controlService: "S3, Config",
      status: "Remediated",
      verified: true
    },
    {
      no: 6,
      riskId: "RSK-006",
      risk: "Unencrypted S3, EBS or RDS storage",
      severity: "High",
      remediation: "Enable SSE-KMS and default encryption",
      controlService: "KMS",
      status: "Remediation Pending",
      verified: false
    },
    {
      no: 7,
      riskId: "RSK-007",
      risk: "KMS key without rotation or scheduled for deletion",
      severity: "Medium",
      remediation: "Enable rotation; alarm on deletion",
      controlService: "KMS, CloudWatch",
      status: "Open",
      verified: false
    },
    {
      no: 8,
      riskId: "RSK-008",
      risk: "CloudTrail disabled or logs not validated",
      severity: "Critical",
      remediation: "Multi-Region trail, validation, SCP protection",
      controlService: "CloudTrail, SCP",
      status: "Remediated",
      verified: true
    },
    {
      no: 9,
      riskId: "RSK-009",
      risk: "No VPC Flow Logs",
      severity: "Medium",
      remediation: "Enable flow logs to encrypted log group",
      controlService: "VPC",
      status: "Remediated",
      verified: true
    },
    {
      no: 10,
      riskId: "RSK-010",
      risk: "Instances allowing IMDSv1",
      severity: "Medium",
      remediation: "Require IMDSv2 on all instances",
      controlService: "EC2, Config",
      status: "Remediated",
      verified: true
    }
  ],

  // Module 1: IAM Details
  iamDetails: {
    roles: [
      {
        name: "SecureArchAdmin",
        arn: "arn:aws:iam::123456789012:role/SecureArchAdmin",
        type: "Federated Role",
        source: "IAM Identity Center",
        mfaEnforced: true,
        boundaryAttached: "SecureArchAdminBoundary",
        description: "Assumed with MFA; boundary prevents privilege escalation & stopping CloudTrail."
      },
      {
        name: "SecureArchAppRole",
        arn: "arn:aws:iam::123456789012:role/SecureArchAppRole",
        type: "EC2 Instance Profile",
        source: "Workload EC2",
        mfaEnforced: false,
        boundaryAttached: "None (Least Privilege)",
        description: "Scopes s3:GetObject, s3:PutObject to app/*, kms:Decrypt on CMK, logs:PutLogEvents."
      },
      {
        name: "SecureArchAuditor",
        arn: "arn:aws:iam::123456789012:role/SecureArchAuditor",
        type: "Read-only Auditor Role",
        source: "Security Team",
        mfaEnforced: true,
        boundaryAttached: "SecurityAudit",
        description: "Read-only access for reviewing CloudTrail, Config findings and security posture."
      }
    ],
    passwordPolicy: {
      minLength: 14,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      maxAgeDays: 90,
      preventReuse: 24,
      allowChange: true,
      status: "ACTIVE_CIS_COMPLIANT"
    },
    permissionBoundaryJson: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowFullAdminExceptRestricted",
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    },
    {
      "Sid": "DenyDisablingCloudTrail",
      "Effect": "Deny",
      "Action": [
        "cloudtrail:StopLogging",
        "cloudtrail:DeleteTrail",
        "cloudtrail:UpdateTrail"
      ],
      "Resource": "arn:aws:cloudtrail:*:123456789012:trail/secure-arch-trail"
    },
    {
      "Sid": "DenyBoundaryRemoval",
      "Effect": "Deny",
      "Action": [
        "iam:DeleteRolePermissionsBoundary",
        "iam:PutRolePermissionsBoundary"
      ],
      "Resource": "arn:aws:iam::123456789012:role/SecureArchAdmin"
    }
  ]
}`,
    appRolePolicyJson: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AppDataAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::secure-arch-data/app/*"
    },
    {
      "Sid": "UseDataKey",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "arn:aws:kms:ap-south-1:123456789012:key/7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f"
    },
    {
      "Sid": "DenyUnencryptedUpload",
      "Effect": "Deny",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::secure-arch-data/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "aws:kms"
        }
      }
    }
  ]
}`,
    accessAnalyzerStatus: "ACTIVE",
    accessAnalyzerFindings: 0,
    credentialHygiene: {
      totalUsers: 0,
      activeLongTermKeys: 0,
      federatedIdentities: 8,
      mfaAdoptionRate: "100%"
    }
  },

  // Module 2: Network Security Details
  networkDetails: {
    vpc: {
      vpcId: "vpc-0a1b2c3d4e5f67890",
      vpcName: "secure-arch-vpc",
      cidr: "10.0.0.0/16",
      region: "ap-south-1",
      dnsHostnames: true,
      dnsResolution: true
    },
    subnets: [
      { name: "Public-1a", az: "ap-south-1a", cidr: "10.0.0.0/24", tier: "Public", purpose: "ALB node, NAT gateway", route: "Internet Gateway (igw-01)", publicIp: true },
      { name: "Public-1b", az: "ap-south-1b", cidr: "10.0.1.0/24", tier: "Public", purpose: "ALB node, NAT gateway", route: "Internet Gateway (igw-01)", publicIp: true },
      { name: "Private-App-1a", az: "ap-south-1a", cidr: "10.0.10.0/24", tier: "Private", purpose: "EC2 application tier", route: "NAT Gateway (nat-01)", publicIp: false },
      { name: "Private-App-1b", az: "ap-south-1b", cidr: "10.0.11.0/24", tier: "Private", purpose: "EC2 application tier", route: "NAT Gateway (nat-01)", publicIp: false },
      { name: "Private-DB-1a", az: "ap-south-1a", cidr: "10.0.20.0/24", tier: "Isolated", purpose: "RDS primary", route: "Local route only (No Internet)", publicIp: false },
      { name: "Private-DB-1b", az: "ap-south-1b", cidr: "10.0.21.0/24", tier: "Isolated", purpose: "RDS standby", route: "Local route only (No Internet)", publicIp: false }
    ],
    securityGroups: [
      {
        id: "sg-01",
        name: "ALB-SG",
        inbound: "TCP 443 from 0.0.0.0/0 (HTTPS only)",
        outbound: "TCP 8080 to App-SG (sg-02)",
        description: "Front-facing load balancer security group with TLS listener."
      },
      {
        id: "sg-02",
        name: "App-SG",
        inbound: "TCP 8080 from ALB-SG (sg-01)",
        outbound: "TCP 3306 to DB-SG (sg-03); TCP 443 to Endpoint-SG (sg-04)",
        description: "Application servers running in private subnets."
      },
      {
        id: "sg-03",
        name: "DB-SG",
        inbound: "TCP 3306 from App-SG (sg-02)",
        outbound: "None (Local isolated processing)",
        description: "Database tier accepts traffic only from application tier."
      },
      {
        id: "sg-04",
        name: "Endpoint-SG",
        inbound: "TCP 443 from VPC CIDR 10.0.0.0/16",
        outbound: "None",
        description: "Interface VPC endpoints for private AWS API communication."
      }
    ],
    nacls: [
      { name: "DB Subnet NACL", type: "Stateless Subnet Boundary", rule: "Inbound TCP 3306 only from 10.0.10.0/24 and 10.0.11.0/24; Deny all other traffic." },
      { name: "Public Subnet NACL", type: "Stateless Perimeter Filtering", rule: "Denies inbound TCP 22 (SSH) and 3389 (RDP) from 0.0.0.0/0; Allows HTTP/HTTPS & ephemeral return ports." }
    ],
    vpcEndpoints: [
      { service: "com.amazonaws.ap-south-1.s3", type: "Gateway", status: "Available", routeTable: "rtb-private-app" },
      { service: "com.amazonaws.ap-south-1.kms", type: "Interface", status: "Available", securityGroup: "Endpoint-SG" },
      { service: "com.amazonaws.ap-south-1.ssm", type: "Interface", status: "Available", securityGroup: "Endpoint-SG" },
      { service: "com.amazonaws.ap-south-1.logs", type: "Interface", status: "Available", securityGroup: "Endpoint-SG" }
    ],
    flowLogs: {
      status: "ACTIVE",
      logGroup: "/aws/vpc/flowlogs/secure-arch-vpc",
      trafficType: "ALL (Accept & Reject)",
      encryption: "SSE-KMS (alias/secure-arch-data)"
    }
  },

  // Module 3: Data Protection Details
  dataProtectionDetails: {
    kmsKey: {
      alias: "alias/secure-arch-data",
      keyId: "7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
      arn: "arn:aws:kms:ap-south-1:123456789012:key/7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
      keySpec: "SYMMETRIC_DEFAULT",
      keyUsage: "ENCRYPT_DECRYPT",
      keyState: "Enabled",
      origin: "AWS_KMS",
      rotationEnabled: true,
      rotationPeriodDays: 365,
      separationOfDuties: "Separates Key Administrators (SecureArchAdmin) from Key Users (SecureArchAppRole)"
    },
    s3Bucket: {
      bucketName: "secure-arch-data",
      arn: "arn:aws:s3:::secure-arch-data",
      encryption: "SSE-KMS (Customer Managed Key)",
      bucketKeyEnabled: true,
      blockPublicAccess: {
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: true,
        restrictPublicBuckets: true
      },
      bucketPolicyEnforced: "Denies unencrypted object uploads and non-TLS connections (aws:SecureTransport: false)",
      versioning: "Enabled"
    },
    rdsEncryption: {
      instanceId: "secure-arch-db",
      engine: "MySQL 8.0 Multi-AZ",
      storageEncrypted: true,
      kmsKeyId: "arn:aws:kms:ap-south-1:123456789012:key/7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
      backupEncryption: true,
      sslForced: true
    },
    ebsEncryption: {
      defaultEncryptionEnabled: true,
      defaultKmsKeyId: "alias/secure-arch-data",
      enforcedRegionWide: true
    },
    transitEncryption: {
      protocol: "TLS 1.2 / TLS 1.3",
      certProvider: "AWS Certificate Manager (ACM)",
      httpRedirectToHttps: true,
      ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-RSA-AES128-GCM-SHA256"
    }
  },

  // Module 4: CloudTrail, Config & Compliance Details
  complianceDetails: {
    cloudTrail: {
      trailName: "secure-arch-trail",
      multiRegion: true,
      isLogging: true,
      logFileValidation: true,
      sha256Digest: "Active",
      kmsKeyId: "alias/secure-arch-data",
      s3Bucket: "secure-arch-audit-logs-123456789012",
      includeGlobalServiceEvents: true,
      cloudWatchLogsStreaming: true,
      cloudWatchLogGroup: "/aws/cloudtrail/secure-arch-trail"
    },
    cloudWatchAlarms: [
      { name: "RootAccountUsageAlarm", metric: "RootAccountUsage", threshold: ">= 1", status: "OK", topic: "arn:aws:sns:ap-south-1:123456789012:security-alerts" },
      { name: "ConsoleSignInWithoutMFAAlarm", metric: "NoMFAConsoleLogin", threshold: ">= 1", status: "OK", topic: "arn:aws:sns:ap-south-1:123456789012:security-alerts" },
      { name: "IAMPolicyChangesAlarm", metric: "IAMPolicyEventCount", threshold: ">= 1", status: "OK", topic: "arn:aws:sns:ap-south-1:123456789012:security-alerts" },
      { name: "SecurityGroupChangesAlarm", metric: "SecurityGroupEventCount", threshold: ">= 1", status: "ALARM", topic: "arn:aws:sns:ap-south-1:123456789012:security-alerts" },
      { name: "KMSKeyDeletionAlarm", metric: "KMSKeyPendingDeletion", threshold: ">= 1", status: "OK", topic: "arn:aws:sns:ap-south-1:123456789012:security-alerts" },
      { name: "CloudTrailStopLoggingAlarm", metric: "StopLoggingCount", threshold: ">= 1", status: "OK", topic: "arn:aws:sns:ap-south-1:123456789012:security-alerts" }
    ],
    awsConfig: {
      recorderStatus: "RECORDING",
      recordingAllResources: true,
      globalIamRecording: true,
      deliveryChannelS3: "secure-arch-config-snapshots-123456789012",
      totalRules: 12,
      compliantRules: 10,
      nonCompliantRules: 2,
      rules: [
        { name: "root-account-mfa-enabled", control: "Root user protected by MFA", module: "Module 1", compliance: "COMPLIANT", severity: "Critical" },
        { name: "iam-user-mfa-enabled", control: "All IAM users use MFA", module: "Module 1", compliance: "NON_COMPLIANT", severity: "High" },
        { name: "iam-password-policy", control: "Password policy meets baseline", module: "Module 1", compliance: "COMPLIANT", severity: "High" },
        { name: "restricted-ssh", control: "No SG allows SSH from 0.0.0.0/0", module: "Module 2", compliance: "NON_COMPLIANT", severity: "High" },
        { name: "vpc-flow-logs-enabled", control: "Flow logs active on VPC", module: "Module 2", compliance: "COMPLIANT", severity: "Medium" },
        { name: "s3-bucket-public-read-prohibited", control: "No public S3 read access", module: "Module 3", compliance: "COMPLIANT", severity: "Critical" },
        { name: "s3-bucket-server-side-encryption-enabled", control: "S3 default encryption on", module: "Module 3", compliance: "COMPLIANT", severity: "High" },
        { name: "encrypted-volumes", control: "All EBS volumes encrypted", module: "Module 3", compliance: "COMPLIANT", severity: "High" },
        { name: "rds-storage-encrypted", control: "RDS storage encrypted", module: "Module 3", compliance: "COMPLIANT", severity: "High" },
        { name: "cmk-backing-key-rotation-enabled", control: "CMK rotation enabled", module: "Module 3", compliance: "COMPLIANT", severity: "Medium" },
        { name: "cloudtrail-enabled", control: "CloudTrail active in account", module: "Module 4", compliance: "COMPLIANT", severity: "Critical" },
        { name: "cloud-trail-log-file-validation-enabled", control: "Log integrity validation on", module: "Module 4", compliance: "COMPLIANT", severity: "Critical" }
      ]
    }
  },

  // Automated SSM Remediation Runbooks
  remediationRunbooks: [
    {
      id: "RUNBOOK-01",
      name: "AWS-DisablePublicAccessForS3Bucket",
      targetFinding: "CFG-001 / S3-006",
      service: "Amazon S3",
      automationDocument: "AWS-DisablePublicAccessForS3Bucket",
      executionMode: "Automated / Approval-Based",
      description: "Applies all 4 Block Public Access parameters to the S3 bucket to prevent accidental exposure."
    },
    {
      id: "RUNBOOK-02",
      name: "AWS-RevokeSecurityGroupIngress",
      targetFinding: "EC2-003",
      service: "Amazon EC2",
      automationDocument: "AWS-RevokeSecurityGroupIngress",
      executionMode: "Automated / Approval-Based",
      description: "Revokes 0.0.0.0/0 ingress on port 22 and notifies security admin."
    },
    {
      id: "RUNBOOK-03",
      name: "AWS-EnableKeyRotation",
      targetFinding: "KMS-004",
      service: "AWS KMS",
      automationDocument: "AWS-EnableKeyRotation",
      executionMode: "Automated / Approval-Based",
      description: "Invokes kms:EnableKeyRotation on the designated customer managed key."
    },
    {
      id: "RUNBOOK-04",
      name: "AWS-EnableServerSideEncryptionForS3",
      targetFinding: "CFG-001",
      service: "Amazon S3",
      automationDocument: "AWS-EnableServerSideEncryptionForS3",
      executionMode: "Automated / Approval-Based",
      description: "Enforces SSE-KMS using customer managed key and enables Bucket Key."
    }
  ],

  // 6-Layer Defence-in-Depth Architecture Layers (from Figure 3.2)
  defenceInDepthLayers: [
    {
      level: 1,
      layer: "Governance",
      color: "#3B82F6",
      services: "AWS Organizations, SCPs, AWS Config",
      description: "Service control policies prevent disabling CloudTrail, deleting Config recorders, or modifying approved regions.",
      status: "Active"
    },
    {
      level: 2,
      layer: "Identity",
      color: "#10B981",
      services: "IAM Identity Center, MFA, Least-Privilege Roles, Permission Boundaries",
      description: "Temporary STS credentials only, zero long-term keys for humans, permission boundaries capping privilege escalation.",
      status: "Active"
    },
    {
      level: 3,
      layer: "Network",
      color: "#F59E0B",
      services: "VPC, Public/Private/Isolated Subnets, Chained SGs, Stateless NACLs, Endpoints",
      description: "Workload segmented into 3 tiers across 2 AZs. ALB on 443 is the only public ingress. DB in isolated subnet with zero internet route.",
      status: "Active"
    },
    {
      level: 4,
      layer: "Compute",
      color: "#8B5CF6",
      services: "Amazon EC2, Hardened AMIs, IMDSv2 Enforced, AWS Systems Manager",
      description: "No SSH port 22 or bastion host. Remote administration solely via SSM Session Manager. Instance metadata v2 enforced.",
      status: "Active"
    },
    {
      level: 5,
      layer: "Data",
      color: "#EC4899",
      services: "AWS KMS (CMK with Rotation), S3 Bucket Key, RDS KMS Encryption, EBS Default Encryption, TLS 1.2+",
      description: "Customer managed key encrypts S3, RDS, EBS and CloudTrail logs. In-transit encryption via ACM TLS 1.2+ certificate.",
      status: "Active"
    },
    {
      level: 6,
      layer: "Detection",
      color: "#06B6D4",
      services: "AWS CloudTrail Multi-Region, AWS Config 12 CIS Rules, CloudWatch Alarms, SNS",
      description: "Tamper-evident activity logging with log file validation SHA-256 digests. Real-time alerting on root and security group changes.",
      status: "Active"
    }
  ]
};
