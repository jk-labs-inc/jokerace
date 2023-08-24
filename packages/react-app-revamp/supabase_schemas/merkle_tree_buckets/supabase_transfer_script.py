import os, json, boto3
from supabase import create_client, Client

# If you have entries in contests_v3 and want to migrate them into the merkle tree bucket

# Changes based on whether dev and prod (and in this order bc it's from supabase -> r2)
supabase_url: str = ""
supabase_key: str = ""

aws_access_key_id: str = ""
aws_secret_access_key: str = ""
BUCKET_NAME: str = ""

# Same for both dev and prod
endpoint_url: str = ""

supabase: Client = create_client(supabase_url, supabase_key)
s3 = boto3.resource('s3',
  endpoint_url = endpoint_url,
  aws_access_key_id = aws_access_key_id,
  aws_secret_access_key = aws_secret_access_key
)

# downloaded_entries = supabase.table("contests_v3").select("votingMerkleTree", "submissionMerkleTree").in_("uuid", ["98c25847-62b8-48b3-a35b-f2fee6448efb", "9170c37e-b746-4b77-90ad-051f849c44b6", "7bd0999b-14f1-4e80-a235-8a116380d1c7", "db8a7395-3c1b-4b89-b572-2ed2c5caac85", "4b689113-636d-45f7-b63c-dfc199d93582", "46d89979-68c5-472e-b0cd-c932ea8cb681", "b5beb6a0-9c63-4501-90c4-fc79145322d9", "99a82554-9cd2-4465-adbf-5e5232c8f78b", "deb910b1-6728-436c-9818-f2b5a1426af8", "6017b2e2-9099-4609-92e8-63b92b967785", "187b4d3e-430a-4b42-9fd9-12f5485a1bed", "569c3059-42fe-4d5f-823f-5a13ccbdb7ba"]).execute()
downloaded_entries = supabase.table("contests_v3").select("*").execute()
downloaded_length = len(downloaded_entries.data)
print(downloaded_length)

counter = 1
for i in downloaded_entries.data:
  print(str(counter) + " / " + str(downloaded_length))

  # If we hit a contest that doesn't have a voting merkle tree, just skip
  votingTree = json.dumps(i["votingMerkleTree"])
  if votingTree == "null":
    counter += 1
    continue

  ### SUBMISSION TREE
  subTreeToUse = json.dumps(i["submissionMerkleTree"])
  if subTreeToUse == "null":
    print("no sub tree")
  else:
    submissions_name = i["submissionMerkleTree"]["merkleRoot"]
    print("submission_name: " + submissions_name)
    f1= open(submissions_name, "w", encoding="utf-8") # MAKE SURE THAT THEY ARE UTF-8 OR THE QUOTATION MARKS WILL BE WRONG AND JSON WON'T PARSE CORRECTLY
    f1.write(json.dumps(i["submissionMerkleTree"]["submitters"]))
    f1.close()

    with open(submissions_name, 'rb+') as f:
      s3.Bucket(BUCKET_NAME).put_object(Key=submissions_name, Body=f)

  ### VOTING TREE
  voting_name = i["votingMerkleTree"]["merkleRoot"]
  print("voting_name: " + voting_name)
  f2 = open(voting_name, "w", encoding="utf-8") # MAKE SURE THAT THEY ARE UTF-8 OR THE QUOTATION MARKS WILL BE WRONG AND JSON WON'T PARSE CORRECTLY
  f2.write(json.dumps(i["votingMerkleTree"]["voters"]))
  f2.close()

  with open(voting_name, 'rb+') as f:
    s3.Bucket(BUCKET_NAME).put_object(Key=voting_name, Body=f)

  counter += 1