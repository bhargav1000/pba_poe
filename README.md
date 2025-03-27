# PBA Hackathon - Proof of Existence
**MJ, Lucas, Bhargav**  
*(inspired by the idea from Shawn Tabrizi)*

## Preface
With the introduction of AI, proof of ownership is paramount to securing a humane identity for all our files. This enables us to engage with global applications while ensuring overall "netizenship" without compromising our identities, and it ensures that our digital assets and beyond are rightfully owned by individuals rather than being controlled by a centralized authority.

## Abstract
We present a decentralized proof-of-existence system for digital files using a static Merkle tree. Each user action (e.g., file upload or deletion) is recorded as a separate, immutable leaf in the Merkle tree. A key feature of this system is its ability to prove that a file was deleted at a specific timestamp, without removing historical data. Instead, deletion is recorded as an independent event, preserving full auditability and transparency.

## 1. Introduction
As digital content proliferates, it is crucial to maintain verifiable records of file ownership and deletion. Rather than relying on centralized authorities, our method leverages the immutable nature of blockchain technology and the efficiency of Merkle trees. In our static tree design, every event is permanently recorded and verifiable, ensuring that both file uploads and subsequent deletions are auditable.

## 2. System Design

### 2.1 File Upload and Event Recording

**File Upload Event:**  
When a file is uploaded, a cryptographic hash is computed from its contents along with associated metadata. In our documentation, we replace sensitive details (like the actual file hash and name) with dummy text.

**Example (upload):**

```json
{
  "user_id": "user123",
  "file_data": "dummyFileHash",
  "file_identifier": "dummyFileName",
  "file_type": "image",
  "timestamp": "2025-03-27T12:34:56Z",
  "event": "upload"
}
```

**Event Immutability:**  
Every upload event is added as a new leaf in the static Merkle tree. Once added, it cannot be altered or removed, ensuring that there is permanent evidence of the file’s existence.

## 2.2 File Deletion as a New Event

**Deletion Event:**  
Instead of updating or removing the original upload leaf, when a user deletes a file, a separate deletion event is appended to the tree. This event references the same file identifier and is marked with a deletion flag.

**Example (deletion):**

```json
{
  "user_id": "user123",
  "file_data": "DELETED",
  "file_identifier": "DELETED",
  "file_type": "image",
  "timestamp": "2025-03-27T15:00:00Z",
  "event": "deletion"
}
```

**Immutable History:**
Both the upload and deletion events are preserved. The static Merkle tree maintains all events, and the Merkle root is updated with each new leaf. This approach ensures that it is possible to verify not only that a file was uploaded, but also that it was deleted at a specific time.

## 2.3 Building and Storing the Merkle Tree
**Tree Construction:**
Each event (upload or deletion) is represented as a leaf node. Leaves are then paired and hashed recursively to build the Merkle tree. The final Merkle root is a compact representation of the entire sequence of events.

**On-Chain Commitment:**
The Merkle root is periodically (or event-driven) stored on-chain. This on-chain record serves as an immutable, timestamped commitment to all recorded file events.

## 3. Verification Process
To prove a particular event (upload or deletion), the following data is provided:

**Event Metadata:** The relevant JSON metadata for the event.

**Merkle Proof:** A set of sibling hashes showing the path from the leaf node (the event) to the Merkle root.

## Verification Steps:

**1. Recompute the Leaf Hash:**
We use the provided metadata (including dummy file data and identifier) to recompute the leaf hash.

**2. Reconstruct the Path:**
Then we iteratively combine the leaf hash with its sibling hashes.

**3. Compare with On-Chain Root:**
We can then confirm that the reconstructed Merkle root matches the on-chain stored root.

This process would also confirm that the event (upload or deletion) was indeed recorded at the given timestamp.

## 4. Sample Metadata for Hash Computation
Below are examples of JSON representations for both upload and deletion events using dummy text:

**Upload Event**
```json
{
  "user_id": "user123",
  "file_data": "dummyFileHash",
  "file_identifier": "dummyFileName",
  "file_type": "image",
  "timestamp": "2025-03-27T12:34:56Z",
  "event": "upload"
}
```

**Deletion Event**
```json
{
  "user_id": "user123",
  "file_data": "DELETED",
  "file_identifier": "DELETED",
  "file_type": "image",
  "timestamp": "2025-03-27T15:00:00Z",
  "event": "deletion"
}
```

Each JSON object is used to compute a leaf hash in the Merkle tree, and each event is appended to the tree as a new leaf. The tree is never modified or pruned; all historical events remain intact, ensuring that the complete timeline of a file’s existence is permanently verifiable.

By adopting a static Merkle tree approach, our system provides an immutable record of file-related events. Uploads and deletions are both recorded as separate events, ensuring that proof of deletion is preserved without modifying or removing historical data. This design enables robust, verifiable proof-of-existence and auditability for file ownership and lifecycle management, while reducing reliance on centralized storage and authorities.

## 5. Transaction Fees for On-Chain Updates
**Merkle Root Updates:** Every time the system computes and submits a new Merkle root to the blockchain, a small fee can be charged to cover the operational and transaction costs. This could be a fixed fee or a percentage of the overall transaction value.

**Batching and Premium Options:** Users who require more frequent updates (e.g., enterprise clients) could pay a premium for batching transactions or for priority processing.
(we are still workshopping these ideas but we are open to opinions 😊)

## 6. Connecting to the Polkadot Virtual Machine (PVM) for On-Chain Updates

In this system, transaction fees for on-chain updates are handled through the Polkadot Virtual Machine (PVM), which executes runtime logic via WebAssembly. By leveraging the PVM, you can securely validate and record Merkle root updates while offloading heavy computations off-chain. Below is an explanation of how this integration works:

### 6.1 Off-Chain Event Processing and Merkle Tree Computation

- **Event Collection:**  
  File uploads and deletions are first collected off-chain. Each event is recorded as a JSON object (with dummy data for privacy) and stored in an off-chain database.

- **Merkle Tree Update:**  
  An off-chain service periodically computes the updated static Merkle tree from the batch of events. This results in a new Merkle root that represents the current state of file events.

- **Proof Generation:**  
  Alongside the new root, the system computes Merkle proofs for individual events. These proofs are essential for later verification of individual events by any verifier.

### 6.2 Integration with the Polkadot Virtual Machine

- **Packaging the Update:**  
  Once the off-chain computation is complete, the updated Merkle root (and, if needed, corresponding proofs) is packaged into an extrinsic (transaction) destined for the Polkadot chain.

- **On-Chain Verification via PVM:**  
  The Polkadot Virtual Machine runs the chain’s runtime modules (compiled to WebAssembly). A dedicated runtime module receives the extrinsic and performs the following steps:
  
  1. **Verify the Update:**  
     The runtime module verifies that the submitted Merkle root correctly represents the batch of events. This can include checking associated metadata or signatures provided by the off-chain service.
  
  2. **State Update:**  
     After successful verification, the module updates the on-chain state with the new Merkle root. This update is recorded on-chain, ensuring that the complete history of file events is immutable.
  
  3. **Transaction Fee Deduction:**  
     The transaction that submits the new Merkle root includes a fee. This fee covers the cost of on-chain execution, storage, and network resource consumption. The fee mechanism is handled by the native Polkadot runtime, ensuring fair compensation for validators.

- **Dynamic Fee Adjustment:**  
  Depending on the number of events or the complexity of the update, fees can be dynamically adjusted. This ensures that users pay a fee proportional to the resource consumption required to process their update.

### 6.3 Advantages of Using the Polkadot Virtual Machine

- **Security and Integrity:**  
  The PVM, with its WebAssembly-based execution, ensures that all runtime logic is executed in a secure, deterministic environment. This builds trust in the integrity of the on-chain state.

- **Scalability:**  
  By moving the heavy computation of Merkle tree updates off-chain and using the PVM only for verification and state updates, the system remains scalable. On-chain storage is minimized to only the compact Merkle root.

- **Cost Efficiency:**  
  With transaction fees covering on-chain operations, the system efficiently manages network resources. Users pay fees that reflect the actual cost of updating the state without incurring high costs for every single file event.

### 6.4 Example Workflow

1. **File Event Occurrence:**  
   A user uploads or deletes a file. The event is recorded off-chain with its corresponding metadata.

2. **Off-Chain Processing:**  
   Periodically, an off-chain service computes the new Merkle tree from the collected events and derives the updated Merkle root.

3. **Extrinsic Creation:**  
   The off-chain service creates an extrinsic containing the new Merkle root and submits it to the Polkadot chain. The extrinsic includes the necessary fees.

4. **On-Chain Execution:**  
   The PVM executes the runtime module, verifies the Merkle root, and updates the on-chain state. The transaction fee is deducted from the user’s balance.

5. **Verification:**  
   Any party can later request a Merkle proof to verify that a specific file event was recorded at a given time by recomputing the Merkle path and comparing it with the stored on-chain root.
