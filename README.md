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

### 2.3 Building and Storing the Merkle Tree
**Tree Construction:**
Each event (upload or deletion) is represented as a leaf node. Leaves are then paired and hashed recursively to build the Merkle tree. The final Merkle root is a compact representation of the entire sequence of events.

**On-Chain Commitment:**
The Merkle root is periodically (or event-driven) stored on-chain. This on-chain record serves as an immutable, timestamped commitment to all recorded file events.

### 3. Verification Process
To prove a particular event (upload or deletion), the following data is provided:

**Event Metadata:** The relevant JSON metadata for the event.

**Merkle Proof:** A set of sibling hashes showing the path from the leaf node (the event) to the Merkle root.

## Verification Steps:

**1. Recompute the Leaf Hash:**
Use the provided metadata (including dummy file data and identifier) to recompute the leaf hash.

**2. Reconstruct the Path:**
Iteratively combine the leaf hash with its sibling hashes.

**3. Compare with On-Chain Root:**
Confirm that the reconstructed Merkle root matches the on-chain stored root.

This process confirms that the event (upload or deletion) was indeed recorded at the given timestamp.

### 4. Sample Metadata for Hash Computation
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