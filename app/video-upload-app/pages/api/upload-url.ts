import type { NextApiRequest, NextApiResponse } from "next";
import { SignedPostPolicyV4Output, Storage } from "@google-cloud/storage";

const fs = require('fs');
const yaml = require('js-yaml');

// Load the YAML file
//const config = yaml.load(fs.readFileSync('vars.yaml', 'utf8'));

// Extract the variables from the YAML file
const googleCloudProject = "machledata-project";
const googleBucketName = "bucket-video-storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignedPostPolicyV4Output | string>
) {
  const { query, method } = req;
  if (method !== "POST") {
    res.status(405).json("Method not allowed");
    return;
  }
  res.status(444).json("On est ici");
  const storage = new Storage({
    projectId: googleCloudProject,
    credentials: {
        client_email: "mlflow-cloudsql-sa@machledata-project.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCRrfJzRwzRVAf+\nrhU3qVF54uFHphIPcHZZPgYwKPOHHV9y8j81HmzgbLx86COx75zCj4F0do+UMcD5\nCixfZAWOEXQW9+Z09i1c/OtrSIlSkMKjAkaRcOppLF/4U1rGpTphs/8ZVWL7ZMl5\nhGCpracUbMisfEMi5oaOq9FDQADRMvYKB/psj0CdFzsajT2DiJYedzuYUv+Qpmoj\nW//g200ELDAOh/p8aXfKwHwanM3Wb/4ZCibG9ty8Myx4A6/1nbpTipU+4fX8aDRh\nfmY7vdF4sFCsfX+4hjLq8KFeFIvVoZDmS9QskcExpKFYyuBTyuetBu725rDcidBB\n/+rWYjRjAgMBAAECggEACMoH4LCes1pwiQsTuKH8inAHy3zXhhrw6P12/hzaZIJ/\nKb431gqZ4whsbtTKooekW5Cw7Mfibbx6ugvFFZRBSYsACAq42sGnhv6zbWuY7WRS\neec/PrMjUWkd+St+RJHfbdmgQHUIXcZ86Vn1Qwd5FyBhExcELezenWj8XSRVaEml\nhK8iR/ZEkHEAKfYu6Mr3n599xUhm0LkEczs/Z2qIwxrGXzyKF0hC4VsRhdwKUtzg\nuJcFsxcw+DaECXWB0038C/28s/rq9IV9wZrZR3kDg3jKn/TGswvMfgjVG5ACU7bd\nlvl1tUoqar7de2WiK35MyXLJrbrvID/tvifHfI7UEQKBgQDDLGm7ej6t/eHSMXJ5\nSaA+4uSWN49pS/W85RBOYhAqnpb6TbUcxty83kuJvsLPgEwNMx/73X+H/TLUvEy7\nRxdpn83TGjX9t2iJht4TyzjwtPzt4v3bZIte+YyozPLtnslAtbQIcRQq01VaNPcO\nDwOW05xWBW5RjE9BQuESVsh/XQKBgQC/FL0AdjqGiJOCW4zrZfEeem6v8itNKeWP\n1UywKEx7gjrcRobmRFp6VVipRFATYn5Z8sAxxIEJ8KEFxK3O8qXz3Cbk/n88SaGj\n64zXZ2+T8irl6UMgx1KFnOC5euqXoNHBHVxQ7Zxsvk6+xVuN01DQq90fUcU7wbjw\nwWKXeRsGvwKBgHBFJREuMc4eg/9IaGQyoRZrqDhs/3b/tf0R+z5LlKcfkROtDajf\nD+0pJmS3MhLw506UgSp98LWGRe4v3ye/rk0ZGun7YuFu1ph911OljDySsAgbkhHZ\nFX7tqCcVtgxQUc6Cd2x/t60m4itA2njg1By3329wMlSAlLqiwRuuhikVAoGASKnA\nPd633tUtExNxgUrg6HAyi2ISKWPXUl0QrqSEgStC6uU/A23W4lJ2Rtgdg2GfHuF7\nSPGrCHajJShn2BzaEuQTPl2xUOHHQCihBIDnI2GiApAz4NErhnfj1WTytPqJCWD6\n7COPqqKsG0u9xy8mulPA4NodoN3IUHWZ4nRBXM0CgYEAjn6AUrDX+vZaZWpla1+X\n4JRkp3AX2+VFXCPEQj0Q0DJLTMwqU1Sr3jsu8a8KmRcTmL3qfLzQA00VS9n4dn7O\n72wAL13vlBruPS6O+Vw8CE7MPys+7CfO17UIX8xQxzxHl4eT6NlTvZuFEmDdBTTa\nZOA3A3NkxTSEmAC8G9FEr48=\n-----END PRIVATE KEY-----\n",
    }
    });

  const bucket = storage.bucket(googleBucketName);
  const file = bucket.file(query.file as string);
  const options = {
    expires: Date.now() + 5 * 60 * 1000, //  5 minutes,
    fields: { "x-goog-meta-source": "nextjs-project" },
  };
  const [response] = await file.generateSignedPostPolicyV4(options);
  res.status(200).json(response);
}