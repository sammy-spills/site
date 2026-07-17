export type InviteeType = "family" | "guest";

export type InviteeRecord = {
  codeHash: string;
  name: string;
  type: InviteeType;
};

export const invitees: readonly InviteeRecord[] = [
  {
    codeHash:
      "5f0bf141d2ad9a6e9c102b5f73e1c3bcd7578ba3cc0bedca87880587b3263b39",
    name: "Caron & Rob",
    type: "family",
  },
  {
    codeHash:
      "42201c9d51e5753829f2174589a812904dd21ac087ffee7daa881234072f2df3",
    name: "Amy & Adrien",
    type: "family",
  },
  {
    codeHash:
      "875ac814a455459acef9b504bfc54309cd700c9f5df5c74d7b9fca338d0377fe",
    name: "Lynn & Stephen",
    type: "family",
  },
  {
    codeHash:
      "4f87ac65276f0de967d35ae8c81d0d584640624f68725538e8557acdea1faf7c",
    name: "Jackie & Garry",
    type: "family",
  },
  {
    codeHash:
      "26ac950fe3c425256c480fa213aa25dca7042cd8abaaef7cd4add4abb947dc5c",
    name: "Luke",
    type: "family",
  },
  {
    codeHash:
      "b4703091998a7c3b4201882020df9246f7342e54f36ba95059292171ea00f869",
    name: "Cass & Dan",
    type: "guest",
  },
  {
    codeHash:
      "75bd6b3fb3901aed91682af9f7f55592d17627d2359c7d0dadd72157d6c409e0",
    name: "Ross & Roxy",
    type: "family",
  },
  {
    codeHash:
      "b4be0b339aacfdc5c5478bf5e7fede3cb99a7e0e5d6a62742482459200ee244f",
    name: "Grandad",
    type: "family",
  },
  {
    codeHash:
      "d328a215c0953266dac730887a787424317d33a2e208ebecbea79dce312eaf73",
    name: "Teresa",
    type: "family",
  },
  {
    codeHash:
      "d693de48d80a7528c4d221dfbb415b51d21e7428ad4aaee5f845b609f5f68650",
    name: "Helen and Henry",
    type: "family",
  },
  {
    codeHash:
      "dde530d9d09dc114cf5d601ce50bbba3b1f1fbcb665ed09c86dc4edded8e866e",
    name: "Tom & Annabell",
    type: "family",
  },
  {
    codeHash:
      "b6affdf89986355010f584fd7d1c5011ae33e6ae794036d2dfae6074a835e705",
    name: "Beth",
    type: "family",
  },
  {
    codeHash:
      "b5d25a511d4e071c12150e518cebc6515a97eed6cde7961a7e20e68fe15ee693",
    name: "Alice",
    type: "family",
  },
  {
    codeHash:
      "2af8a723bd5c5d7067271591d3ef3bbf4f056d1fff7321c74f6acdc5558139d3",
    name: "Nana & Pa",
    type: "family",
  },
  {
    codeHash:
      "4613b5784beb9f12cd1c61ff02fff1f75911615d68b64f354744e7e159006c57",
    name: "Aunty Gay",
    type: "family",
  },
  {
    codeHash:
      "a9250c650dde3750666c91713565594c1458776ad063dbd2f893d78564ecf4ea",
    name: "Helen & Graham",
    type: "family",
  },
  {
    codeHash:
      "577c6fb0994f6d21f3da96be9b44b80549de9436fd1c93b67d2f20cc2b197214",
    name: "Bryn & Libby",
    type: "family",
  },
  {
    codeHash:
      "579de4d178beb7fa64fc77c40ea483646abcb036f6be11486b5e08fa3933e1aa",
    name: "Caroline, Mark & Alfie",
    type: "family",
  },
  {
    codeHash:
      "7b1369a82b1cd442ab8a99b00c72337cde73ec31709c250d5c573567bdc667d0",
    name: "Sue, Rob & Hollie",
    type: "family",
  },
  {
    codeHash:
      "f5944de8884e063cec06aaf9f82b32e09a7814fbed6731c02998c8186262402e",
    name: "Bali & Dave",
    type: "family",
  },
  {
    codeHash:
      "9ba69a4776cc73f8454cff61caf22c2f71c49c9b8ccbd77d37e7a9ae1595cb15",
    name: "Mudge and Nick",
    type: "family",
  },
  {
    codeHash:
      "22f3315883162e85b9402d1f668743932a55245bc1f7a999d7c5849f24f771d5",
    name: "Jen & Chloe",
    type: "guest",
  },
  {
    codeHash:
      "4bbb3f7a19a8119866ef709134aaf256d24b7bd0ddd5f2a5740e52e568192dbf",
    name: "Dani & Joe",
    type: "guest",
  },
  {
    codeHash:
      "83dcb2c0a432ad7920c7f0f83bbe49853a1e98ebd8946e175846e6bb9a899516",
    name: "Zoe & Tom",
    type: "guest",
  },
  {
    codeHash:
      "6fde6dec194fbc81fd347ca06c72d500c473fd68c2a06deb738aa07a597f8d55",
    name: "Hannah & Gary",
    type: "guest",
  },
  {
    codeHash:
      "428257ba4fdb7d2fe4c388e64a768727b08325bdd1b2d1e8dd0b06ebfeb56604",
    name: "Pete & Abi",
    type: "guest",
  },
  {
    codeHash:
      "be5d6685d624f3410c0a648c14be7df3476f02e68c4adec9ec62eca85a39534e",
    name: "Carla & Mike",
    type: "guest",
  },
  {
    codeHash:
      "b1326a9355b834e28a0acce3bf2df8b7116118f5aec37a109c13bcf8f8cd7e56",
    name: "Elliot & Laura",
    type: "guest",
  },
  {
    codeHash:
      "16d18181b7e9cc1bb9f593e89627d5f45dbea54db8a13a030241769eaa1b6799",
    name: "Robbie & Emma",
    type: "guest",
  },
  {
    codeHash:
      "3b0373b6d1a2fa45c1a3ebf6d79108e3edc6e6dbebc548496e7cd5e822ed92a0",
    name: "Zez & Tixa",
    type: "guest",
  },
  {
    codeHash:
      "117d9503a02ff53fe811439cd0ff83ccc55313f9e5f3c70bdf2831885d58816c",
    name: "Max",
    type: "guest",
  },
  {
    codeHash:
      "cb875e259130d972510202ef0d7af904f284db0034673bf04c5187e4f272eedd",
    name: "Rach & Jess",
    type: "guest",
  },
  {
    codeHash:
      "603d98819d9be357cd77982b64628a73da08fc1a29aea6341b1cdeb09d78fb2b",
    name: "Sunil & Priya",
    type: "guest",
  },
  {
    codeHash:
      "25a062c72d5abc78ae0b4407f6a3c97f3079cdc9e765bae87495e8f01983b529",
    name: "Tom & Patsie",
    type: "guest",
  },
  {
    codeHash:
      "e955623b3f14e7fe9f93403c094b9d5e45f1fb3274935e1a0ca3519b44e8f564",
    name: "Alex & Finn",
    type: "guest",
  },
  {
    codeHash:
      "7bd223fd559561182e3852c9a87150c28c80bc5f34d33e5a8e008d88553100da",
    name: "Hannah & Will",
    type: "guest",
  },
  {
    codeHash:
      "2f1d4a1a5c0caa1f68b82f96f6e34cde6c235e7424082548b59a63588700794f",
    name: "Lily & Toby",
    type: "guest",
  },
  {
    codeHash:
      "706305f0f5254e58eb9f0ebc256e821462dfbab7798e43502a687bf13ee4aea0",
    name: "Miles & Laura",
    type: "guest",
  },
  {
    codeHash:
      "58f0aafde8d87d91eec3da3373053ac1a9b70f948b5e1f2856a0fdbdf778c0b2",
    name: "Beth & Laurence",
    type: "guest",
  },
  {
    codeHash:
      "93d362e5e6a0e437f57b24c907cc724dcbc2a8aa78e555f347c039af7029d2a8",
    name: "Lucy & Ted",
    type: "guest",
  },
  {
    codeHash:
      "3491b1a39465632e7bcf711010e62ddf1df60856f79f66c46b3183bd0b87d72c",
    name: "Jamie & Evie",
    type: "guest",
  },
  {
    codeHash:
      "4eea54f715e20f4afe11e9ddea68f56658c3c310b14a687d0e4b2e657e15c992",
    name: "Rufus & Beth",
    type: "guest",
  },
  {
    codeHash:
      "2cd0cfd55c7d50341e2e149fbc58127b6c4e7ba1960ff259093d5ad3c4181dbb",
    name: "Rob & Pip",
    type: "guest",
  },
  {
    codeHash:
      "1e328323eb281b85173c42977362ebae15775ddf5e9f5fdbe38557ac27224cff",
    name: "Patrick & Becca",
    type: "guest",
  },
  {
    codeHash:
      "c400fa9a52d1bab7f8c2241f87befc2e7f846fc0f40e4fa93aafc5b096a9bf61",
    name: "Martin & Emma",
    type: "guest",
  },
  {
    codeHash:
      "3446743ccda2f2fb3fb7383bb9cfc4f8b3cb278433d4ea6f956fb9fd91ade515",
    name: "Greg & Laura",
    type: "guest",
  },
  {
    codeHash:
      "0211cac786a460172319aa0e57948db4b23580386f2c0f95d232963a0dd7c03d",
    name: "Beky & Rich",
    type: "guest",
  },
  {
    codeHash:
      "b7d299f582d62019661cb032e6309630901fabf4325ca1fb568def53d535bed5",
    name: "Lindsay & Steve",
    type: "guest",
  },
] as const;

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}
