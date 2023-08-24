import os, json
from supabase import create_client, Client

# If you have entries in contests_v3 and want to migrate them into the merkle tree bucket

url: str = ""
key: str = ""
supabase: Client = create_client(url, key)
downloaded_entries = supabase.table("contests_v3").select("network_name", "address", "votingMerkleTree", "submissionMerkleTree").in_("uuid", ["9ececd47-5e70-4f5f-a6a6-cafe7fe57f8c"]).execute()

print(len(downloaded_entries.data))

for i in downloaded_entries.data:

  ### SUBMISSION TREE
  subTreeToUse = json.dumps(i["submissionMerkleTree"])
  if subTreeToUse == "None":
    print("no sub tree")
  else:
    submissions_name = i["submissionMerkleTree"]["merkleRoot"]
    f = open(submissions_name, "w", encoding="utf-8") # MAKE SURE THAT THEY ARE UTF-8 OR THE QUOTATION MARKS WILL BE WRONG AND JSON WON'T PARSE CORRECTLY
    f.write(json.dumps(i["submissionMerkleTree"]["submitters"]))
    f.close()

    with open(name, 'rb+') as f:
      # TODO: upload to R2
      continue

  ### VOTING TREE
  voting_name = i["votingMerkleTree"]["merkleRoot"]
  f = open(voting_name, "w", encoding="utf-8") # MAKE SURE THAT THEY ARE UTF-8 OR THE QUOTATION MARKS WILL BE WRONG AND JSON WON'T PARSE CORRECTLY
  f.write(json.dumps(i["votingMerkleTree"]["voters"]))
  f.close()

  with open(name, 'rb+') as f:
    # TODO: upload to R2
    continue