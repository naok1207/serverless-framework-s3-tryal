import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({});

export const upload = async (event, context, callback) => {
  const { base64_image, key } = JSON.parse(event.body);
  try {
    const base64 = base64_image.replace(/data:.+;base64,/, "");

    // ファイルの拡張子を取得
    const fileExtension = base64_image
      .toString()
      .slice(base64_image.indexOf("/") + 1, base64_image.indexOf(";"));

    // ContentType(image/png)を取得
    const contentType = base64_image
      .toString()
      .slice(base64_image.indexOf(":") + 1, base64_image.indexOf(";"));

    const imageBuf = Buffer.from(base64, "base64");

    const bucketParams = {
      Bucket: process.env.BUCKET,
      Key: [key, fileExtension].join("."),
      Body: imageBuf,
      ContentType: contentType,
    };

    console.log({ bucketParams });

    const result = await client.send(new PutObjectCommand(bucketParams));
    console.log(result);
    return response(200, true, { message: "file saved to S3" });
  } catch (err) {
    console.error(err);
    return response(500, false, { message: "Error saving file to S3" });
  }
};

export const getImage = async (event, context, callback) => {
  const { key } = event.queryStringParameters;
  try {
    const bucketParams = {
      Bucket: process.env.BUCKET,
      Key: key,
    };
    console.log({ bucketParams });
    const data = await client.send(new GetObjectCommand(bucketParams));
    const objectData = data.Body;
    const base64Data = await objectData.transformToString("base64");
    const contentType = data.ContentType;
    const body = {
      base64Data,
      contentType,
    };
    return response(200, true, {
      message: "Success to get file from S3",
      ...body,
    });
  } catch (err) {
    console.log(err);
    return response(500, false, { message: "Error get file from S3" });
  }
};

const response = (statusCode, success, params) => {
  return {
    statusCode,
    body: JSON.stringify({
      success,
      ...params,
    }),
  };
};
