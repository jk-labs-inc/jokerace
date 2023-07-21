import os, json
from supabase import create_client, Client

# If you have entries in contests_v3_participants and want to migrate them into the merkle tree bucket

url: str = ""
key: str = ""
supabase: Client = create_client(url, key)
downloaded_entries = supabase.table("contests_v3").select("network_name", "address", "votingMerkleTree", "submissionMerkleTree").in_("uuid", ["9ececd47-5e70-4f5f-a6a6-cafe7fe57f8c"]).execute()

print(len(downloaded_entries.data))

for i in downloaded_entries.data:
  name = i["network_name"] + "_" + i["address"]
  subTreeToUse = json.dumps(i["submissionMerkleTree"])
  if subTreeToUse == "None":
    subTreeToUse = "null"
  f = open(name, "w", encoding="utf-8") # MAKE SURE THAT THEY ARE UTF-8 OR THE QUOTATION MARKS WILL BE WRONG AND JSON WON'T PARSE CORRECTLY
  f.write("{\"votingMerkleTree\":" + json.dumps(i["votingMerkleTree"]) + ",\"submissionMerkleTree\":" + subTreeToUse + "}")
  f.close()

  with open(name, 'rb+') as f:
    supabase.storage.from_("merkle_trees").upload(path=name, file=name)