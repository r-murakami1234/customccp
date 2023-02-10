import os
import boto3
import pandas as pd

s3_client = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
# DynamoDBテーブル名
table    = dynamodb.Table('ACTestCustomer-2')
# S3のバケットの環境変数名
bucket_name = os.environ['bucket_name']

def lambda_handler(event, context):
    # プレフィックスの環境変数名
    prefix = os.environ['prefix']
    print(bucket_name)

    s3 = boto3.client('s3')
    obj = s3.get_object(Bucket=bucket_name, Key=prefix)
    
    # panda関数でCSVを読む
    csv = pd.read_csv(obj['Body'], dtype='object') 
    
    # 実行するたびに上書き
    for items, item in csv.iterrows():
        try:
            table.put_item(
                Item = {
                    "UserID"  : str(item['UserID']),
                    "Name"  : str(item['Name']),
                    "PhoneNumber"  : str(item['PhoneNumber'])
                }
            )
        except Exception as e:
            print(e)