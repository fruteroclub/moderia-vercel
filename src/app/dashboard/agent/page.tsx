"use client";

import { faker } from "@faker-js/faker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { Session, SessionStatus } from "@/types/session";

const conversations = [
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Smart Contract Development Session
⏱️ Duration: 45 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Welcome to today's Solidity basics session!
Student: Thanks! I'm excited to start - been waiting to learn smart contracts.
Host: Let's begin with state variables. What's your coding background?
Student: Mostly JavaScript. This is different but I'm getting it!
Host: Perfect. Let's write your first contract. Type 'contract MyToken {'
Student: Oh, this syntax feels familiar. I'm finally understanding!
Host: Excellent! Now let's add a mapping for balances.
Student: This is actually fun - reminds me of objects in JavaScript.
Host: You're catching on quickly. Let's try events next.
Student: I see why events are important. Makes total sense now!

📊 **Call Analysis Results**
⏱️ Call Duration: 45 minutes

👥 **Speaker Breakdown:**
- Instructor: 45%
- Student: 55%

📈 **Engagement Metrics:**
- Questions Asked: 12
- Concepts Practiced: 8
- Code Examples: 6

⭐ **Quality Score: 9.2/10**
✅ Quality threshold passed!

📋 **Action Items:**
- Complete basic ERC20 implementation
- Review event logging patterns
- Practice modifier syntax
- Read suggested gas optimization guide

🔑 **Key Terms:**
- State Variables
- Mappings
- Events
- Modifiers
- Gas Optimization

💡 **Session Highlights:**
- Strong student engagement
- Clear concept progression
- Practical code implementation
- Positive learning indicators
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: DeFi Security Review
⏱️ Duration: 30 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's review your DeFi protocol security.
Student: *Joins 10 minutes late* Sorry, had technical issues.
Host: No problem. Have you reviewed the materials I sent?
Student: Um, not yet... been busy.
Host: Okay. Let's start with reentrancy guards. Do you understand why we need them?
Student: Not really... can we go slower?
Host: *Explains basic concept* Does this make more sense?
Student: *Silence* ... It's quite complicated.
Host: Should we perhaps restart from fundamentals?
Student: Maybe... this is harder than I expected.

📊 **Call Analysis Results**
⏱️ Call Duration: 30 minutes

👥 **Speaker Breakdown:**
- Instructor: 80%
- Student: 20%

📈 **Engagement Metrics:**
- Questions Asked: 3
- Concepts Practiced: 2
- Code Examples: 1

⭐ **Quality Score: 4.5/10**
❌ Quality threshold not met

📋 **Action Items:**
- Review Solidity basics
- Complete prerequisite materials
- Reschedule when prepared
- Practice basic security patterns

🔑 **Key Terms:**
- Reentrancy
- Security Guards
- Access Control

💡 **Session Concerns:**
- Low engagement
- Lack of preparation
- Fundamental knowledge gaps
- Time management issues
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Gas Optimization Workshop
⏱️ Duration: 60 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Today we're optimizing your NFT contract.
Student: Great! I've already identified some expensive functions.
Host: Impressive initiative! Show me what you found.
Student: Look at this mint function - I think we can reduce storage.
Host: Excellent observation! This is exactly what we look for.
Student: This is fascinating! The gas savings are significant.
Host: Want to try optimizing the batch transfer next?
Student: Absolutely! I'm really enjoying this optimization process.
Host: Your enthusiasm shows in your work quality.
Student: It's challenging but so rewarding when we see the improvements!

📊 **Call Analysis Results**
⏱️ Call Duration: 60 minutes

👥 **Speaker Breakdown:**
- Instructor: 40%
- Student: 60%

📈 **Engagement Metrics:**
- Questions Asked: 15
- Concepts Practiced: 10
- Code Examples: 8

⭐ **Quality Score: 9.8/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Implement suggested optimizations
- Benchmark gas improvements
- Document optimization patterns
- Schedule follow-up review

🔑 **Key Terms:**
- Gas Optimization
- Storage Slots
- Batch Operations
- Memory vs Storage

💡 **Session Highlights:**
- Exceptional preparation
- Strong technical insights
- Active problem-solving
- High engagement throughout
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Smart Contract Testing Workshop
⏱️ Duration: 45 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's dive into testing your lending protocol.
Student: I've set up Hardhat and written basic tests.
Host: Great start! Show me your test coverage report.
Student: Here it is - 92% coverage on core functions!
Host: Impressive! Let's add fuzzing tests next.
Student: Oh wow, this catches edge cases I missed.
Host: Exactly! Security is all about edge cases.
Student: This is eye-opening. Testing is actually exciting!

📊 **Call Analysis Results**
⏱️ Call Duration: 45 minutes

👥 **Speaker Breakdown:**
- Instructor: 45%
- Student: 55%

📈 **Engagement Metrics:**
- Tests Written: 15
- Bugs Found: 8
- Coverage Improved: +15%

⭐ **Quality Score: 9.5/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Add invariant testing
- Implement fuzz testing
- Document test scenarios
- Review coverage gaps

🔑 **Key Terms:**
- Fuzzing
- Test Coverage
- Edge Cases
- Invariants

💡 **Session Highlights:**
- High test coverage
- Strong problem-solving
- Proactive learning
- Security mindset
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: MEV Protection Strategies
⏱️ Duration: 30 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Today we'll discuss MEV protection.
Student: *Camera off* Can you hear me?
Host: Yes. Have you looked at the flashbots docs?
Student: No... what's flashbots?
Host: *Sighs* This was in the pre-reading materials.
Student: Sorry, I'll check them later.
Host: We really need preparation for these topics.
Student: Can we do something easier?

📊 **Call Analysis Results**
⏱️ Call Duration: 30 minutes

👥 **Speaker Breakdown:**
- Instructor: 85%
- Student: 15%

📈 **Engagement Metrics:**
- Questions Asked: 2
- Concepts Covered: 1
- Practical Examples: 0

⭐ **Quality Score: 3.8/10**
❌ Quality threshold not met

📋 **Action Items:**
- Review MEV basics
- Study Flashbots documentation
- Complete preparation work
- Reschedule when ready

🔑 **Key Terms:**
- MEV
- Flashbots
- Frontrunning

💡 **Session Concerns:**
- Zero preparation
- Minimal engagement
- Basic knowledge missing
- Time wasted
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: ZK Rollups Deep Dive
⏱️ Duration: 60 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Ready to explore ZK rollup implementation?
Student: Yes! Been studying the StarkWare papers.
Host: Excellent! What confused you most?
Student: The circuit constraints part. But I think I get it now.
Host: Let's implement a simple circuit together.
Student: This makes so much sense in practice!
Host: Your preparation really shows.
Student: I love how it all connects together!

📊 **Call Analysis Results**
⏱️ Call Duration: 60 minutes

👥 **Speaker Breakdown:**
- Instructor: 40%
- Student: 60%

📈 **Engagement Metrics:**
- Concepts Mastered: 12
- Examples Implemented: 8
- Questions Resolved: 15

⭐ **Quality Score: 9.7/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Complete circuit implementation
- Study proof generation
- Review gas optimizations
- Schedule advanced session

🔑 **Key Terms:**
- ZK Rollups
- Circuit Constraints
- Proof Generation
- State Transitions

💡 **Session Highlights:**
- Outstanding preparation
- Deep technical grasp
- Excellent engagement
- Clear progression
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: ERC721A Implementation
⏱️ Duration: 45 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's optimize your NFT contract.
Student: I've migrated from ERC721 to ERC721A!
Host: Show me the gas savings.
Student: Look - 60% reduction in mint costs!
Host: Outstanding! What's next?
Student: Thinking about implementing lazy minting.
Host: Perfect direction. Let's plan that out.
Student: This is exactly what I hoped to learn!

📊 **Call Analysis Results**
⏱️ Call Duration: 45 minutes

👥 **Speaker Breakdown:**
- Instructor: 35%
- Student: 65%

📈 **Engagement Metrics:**
- Optimizations Found: 10
- Gas Saved: 60%
- Features Added: 5

⭐ **Quality Score: 9.6/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Implement lazy minting
- Add batch transfers
- Document gas savings
- Plan marketplace integration

🔑 **Key Terms:**
- ERC721A
- Gas Optimization
- Lazy Minting
- Batch Operations

💡 **Session Highlights:**
- Self-directed learning
- Practical improvements
- Measurable results
- Clear goals
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Solidity Security Patterns
⏱️ Duration: 40 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's review common attack vectors.
Student: *Joins late* My internet was down...
Host: That's the third time this week.
Student: Yeah... can you explain reentrancy again?
Host: We covered this last session.
Student: Sorry, I forgot to take notes.
Host: This pattern isn't working.
Student: Maybe I should take a break.

📊 **Call Analysis Results**
⏱️ Call Duration: 40 minutes

👥 **Speaker Breakdown:**
- Instructor: 90%
- Student: 10%

📈 **Engagement Metrics:**
- Topics Reviewed: 2
- Questions Asked: 1
- Examples Completed: 0

⭐ **Quality Score: 3.2/10**
❌ Quality threshold not met

📋 **Action Items:**
- Address attendance issues
- Review basic concepts
- Improve preparation
- Consider course pause

🔑 **Key Terms:**
- Reentrancy
- Security Patterns
- Attack Vectors

💡 **Session Concerns:**
- Chronic tardiness
- Lack of progress
- Poor preparation
- Engagement issues
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: DeFi Protocol Design
⏱️ Duration: 55 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: How's the yield aggregator coming along?
Student: Made great progress! Look at these tests.
Host: These invariants are well thought out.
Student: Learned from our last session!
Host: Want to try formal verification next?
Student: Yes please! Already started reading about it.
Host: Your progress is remarkable.
Student: It's challenging but fascinating!

📊 **Call Analysis Results**
⏱️ Call Duration: 55 minutes

👥 **Speaker Breakdown:**
- Instructor: 40%
- Student: 60%

📈 **Engagement Metrics:**
- Features Implemented: 8
- Tests Added: 20
- Bugs Prevented: 12

⭐ **Quality Score: 9.8/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Add formal verification
- Complete integration tests
- Document protocol design
- Plan mainnet deployment

🔑 **Key Terms:**
- Yield Aggregation
- Formal Verification
- Protocol Design
- Test Invariants

💡 **Session Highlights:**
- Exceptional progress
- Proactive learning
- Strong testing focus
- Clear understanding
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Layer 2 Scaling Solutions
⏱️ Duration: 50 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's explore L2 deployment options.
Student: I've researched Optimism vs Arbitrum!
Host: What differences did you find?
Student: The fraud proof mechanisms vary...
Host: Excellent observation! Let's dig deeper.
Student: This is fascinating! The tradeoffs are interesting.
Host: You've really done your homework.
Student: Can't wait to implement this!

📊 **Call Analysis Results**
⏱️ Call Duration: 50 minutes

👥 **Speaker Breakdown:**
- Instructor: 45%
- Student: 55%

📈 **Engagement Metrics:**
- Topics Covered: 10
- Comparisons Made: 8
- Solutions Analyzed: 5

⭐ **Quality Score: 9.4/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Compare deployment costs
- Test on testnets
- Document findings
- Plan migration strategy

🔑 **Key Terms:**
- Optimistic Rollups
- Fraud Proofs
- Layer 2 Scaling
- Cross-chain Bridge

💡 **Session Highlights:**
- Deep research
- Critical analysis
- Enthusiasm
- Technical depth
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Token Economics Design
⏱️ Duration: 45 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Shall we review your tokenomics?
Student: Yes! I modeled different scenarios.
Host: These simulations look thorough.
Student: Python made it easy to test assumptions.
Host: Great use of quantitative analysis!
Student: The game theory aspects are fascinating.
Host: Your approach is very methodical.
Student: Learning so much from this process!

📊 **Call Analysis Results**
⏱️ Call Duration: 45 minutes

👥 **Speaker Breakdown:**
- Instructor: 40%
- Student: 60%

📈 **Engagement Metrics:**
- Models Created: 6
- Scenarios Tested: 15
- Parameters Optimized: 10

⭐ **Quality Score: 9.5/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Refine emission schedule
- Model stake incentives
- Document assumptions
- Plan governance structure

🔑 **Key Terms:**
- Tokenomics
- Game Theory
- Emission Schedule
- Stake Incentives

💡 **Session Highlights:**
- Quantitative approach
- Strong modeling
- Clear understanding
- Strategic thinking
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Smart Contract Upgrades
⏱️ Duration: 35 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's implement the upgrade pattern.
Student: *Audio issues* Can you repeat that?
Host: Is your connection stable now?
Student: Think so... what's a proxy contract?
Host: We covered this in the prerequisites.
Student: Must have missed that part.
Host: This topic requires preparation.
Student: Maybe I should start with basics.

📊 **Call Analysis Results**
⏱️ Call Duration: 35 minutes

👥 **Speaker Breakdown:**
- Instructor: 85%
- Student: 15%

📈 **Engagement Metrics:**
- Concepts Grasped: 1
- Questions Asked: 3
- Examples Completed: 0

⭐ **Quality Score: 4.0/10**
❌ Quality threshold not met

📋 **Action Items:**
- Review proxy patterns
- Study upgrade mechanics
- Complete prerequisites
- Reschedule when ready

🔑 **Key Terms:**
- Proxy Patterns
- Contract Upgrades
- Storage Slots

💡 **Session Concerns:**
- Technical issues
- Lack of preparation
- Basic knowledge gaps
- Poor time usage
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Decentralized Identity Implementation
⏱️ Duration: 55 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's explore DID implementation today.
Student: I've been researching ERC-725!
Host: Excellent! What aspects interest you most?
Student: The key management system is fascinating. I've prototyped something.
Host: Show me what you've built.
Student: *Shares screen* Here's my implementation of key delegation.
Host: Very thoughtful approach! Have you considered recovery mechanisms?
Student: Yes! I was thinking of social recovery using threshold signatures.
Host: That's exactly the direction I'd recommend.
Student: Great! I've also documented potential security considerations.

📊 **Call Analysis Results**
⏱️ Duration: 55 minutes

👥 **Speaker Breakdown:**
- Instructor: 35%
- Student: 65%

📈 **Engagement Metrics:**
- Features Implemented: 7
- Security Considerations: 12
- Documentation Quality: High

⭐ **Quality Score: 9.7/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Implement social recovery
- Add threshold signatures
- Complete security audit
- Prepare for testnet deployment

🔑 **Key Terms:**
- ERC-725
- Key Management
- Social Recovery
- Threshold Signatures

💡 **Session Highlights:**
- Outstanding preparation
- Implementation ready
- Security-focused approach
- Clear understanding
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Cross-chain Bridge Development
⏱️ Duration: 40 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: How's the bridge implementation going?
Student: *Audio cutting out* Sorry... connection issues...
Host: Should we reschedule?
Student: No, let's continue... *long pause* Can you see my screen?
Host: No screen share visible. Have you started coding?
Student: Not yet... having trouble with the setup.
Host: Did you follow the environment setup guide?
Student: I tried but got stuck... *connection drops*

📊 **Call Analysis Results**
⏱️ Duration: 40 minutes

👥 **Speaker Breakdown:**
- Instructor: 80%
- Student: 20%

📈 **Engagement Metrics:**
- Technical Issues: Many
- Progress Made: Minimal
- Setup Completed: No

⭐ **Quality Score: 3.5/10**
❌ Quality threshold not met

📋 **Action Items:**
- Resolve technical setup
- Complete environment configuration
- Review prerequisites
- Reschedule session

🔑 **Key Terms:**
- Bridge Architecture
- Cross-chain Communication
- Environment Setup

💡 **Session Concerns:**
- Technical difficulties
- No progress made
- Poor preparation
- Time inefficiently used
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: DAO Governance Implementation
⏱️ Duration: 50 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Ready to implement the voting mechanism?
Student: Yes! I've studied Compound and Aave's approaches.
Host: What differences did you notice?
Student: Their quorum calculations vary interestingly.
Host: Good observation! Which approach fits your needs?
Student: I'm leaning towards Compound's style but with modifications.
Host: Tell me about your proposed changes.
Student: I want to add time-weighted voting and delegation caps.
Host: Interesting! Let's model those incentives.
Student: I've already started simulations in Python!

📊 **Call Analysis Results**
⏱️ Duration: 50 minutes

👥 **Speaker Breakdown:**
- Instructor: 40%
- Student: 60%

📈 **Engagement Metrics:**
- Research Depth: High
- Implementation Ideas: 8
- Simulations Run: 5

⭐ **Quality Score: 9.6/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Complete voting simulations
- Implement time-weighted voting
- Add delegation caps
- Document governance rules

🔑 **Key Terms:**
- Governance Mechanisms
- Time-weighted Voting
- Delegation Systems
- Quorum Calculation

💡 **Session Highlights:**
- Deep research conducted
- Novel implementation ideas
- Proactive approach
- Strong technical foundation
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Oracle Implementation Patterns
⏱️ Duration: 45 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's discuss oracle security today.
Student: *Joins 15 minutes late* Sorry, overslept.
Host: Have you reviewed the Chainlink documentation?
Student: Uh... not really. Is that important?
Host: *Patiently* Yes, it's crucial for today's topic.
Student: Can you just explain the basics?
Host: We really need that foundation first.
Student: This seems complicated...

📊 **Call Analysis Results**
⏱️ Duration: 30 minutes (effective)

👥 **Speaker Breakdown:**
- Instructor: 75%
- Student: 25%

📈 **Engagement Metrics:**
- Preparation: None
- Questions Asked: 2
- Concepts Covered: 1

⭐ **Quality Score: 4.2/10**
❌ Quality threshold not met

📋 **Action Items:**
- Review Chainlink docs
- Study oracle patterns
- Complete prerequisites
- Reschedule when prepared

🔑 **Key Terms:**
- Oracle Security
- Data Feeds
- Price Aggregation

💡 **Session Concerns:**
- Late arrival
- No preparation
- Low engagement
- Time management issues
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: NFT Marketplace Development
⏱️ Duration: 60 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: How's the marketplace contract coming along?
Student: Great! I've implemented Dutch auctions.
Host: Show me your test cases.
Student: *Shares screen* Here's 100% coverage with fuzzing.
Host: Impressive! Any interesting edge cases?
Student: Found some in price calculations - already fixed!
Host: What's next on your roadmap?
Student: Implementing batch listings and royalty splitting.
Host: Perfect direction. Need any guidance there?
Student: Just on optimizing the batch operations.

📊 **Call Analysis Results**
⏱️ Duration: 60 minutes

👥 **Speaker Breakdown:**
- Instructor: 40%
- Student: 60%

📈 **Engagement Metrics:**
- Code Coverage: 100%
- Features Completed: 10
- Tests Written: 25

⭐ **Quality Score: 9.8/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Implement batch listings
- Add royalty splitting
- Optimize gas usage
- Prepare for audit

🔑 **Key Terms:**
- Dutch Auctions
- Batch Operations
- Royalty Management
- Gas Optimization

💡 **Session Highlights:**
- Complete test coverage
- Proactive development
- Clear roadmap
- Strong technical skills
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Solidity Advanced Patterns
⏱️ Duration: 45 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Ready to explore advanced patterns?
Student: Sort of... still struggling with basics.
Host: What's giving you trouble?
Student: Everything after functions... *sighs*
Host: Let's step back. Show me your practice code.
Student: I haven't written any yet...
Host: That makes it difficult to progress.
Student: Maybe I should start with tutorials?

📊 **Call Analysis Results**
⏱️ Duration: 45 minutes

👥 **Speaker Breakdown:**
- Instructor: 70%
- Student: 30%

📈 **Engagement Metrics:**
- Code Written: None
- Concepts Grasped: 2
- Practice Done: Minimal

⭐ **Quality Score: 4.8/10**
❌ Quality threshold not met

📋 **Action Items:**
- Complete basic tutorials
- Write practice code
- Review fundamentals
- Schedule beginner session

🔑 **Key Terms:**
- Function Modifiers
- State Variables
- Basic Syntax

💡 **Session Concerns:**
- Lack of practice
- Fundamental gaps
- Poor preparation
- Mismatched level
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: DeFi Yield Strategies
⏱️ Duration: 55 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's review your yield optimization strategy.
Student: I've modeled several approaches!
Host: Walk me through your simulations.
Student: *Shares detailed Python notebooks*
Host: These risk calculations are thorough.
Student: Thanks! I included impermanent loss analysis.
Host: Very comprehensive. What's your next step?
Student: Planning to implement auto-rebalancing.
Host: Perfect! Any concerns about gas costs?
Student: Yes, I've already optimized the main paths.

📊 **Call Analysis Results**
⏱️ Duration: 55 minutes

👥 **Speaker Breakdown:**
- Instructor: 35%
- Student: 65%

📈 **Engagement Metrics:**
- Models Created: 8
- Strategies Analyzed: 12
- Risk Scenarios: 15

⭐ **Quality Score: 9.7/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Implement auto-rebalancing
- Optimize gas usage
- Complete risk documentation
- Prepare for audit

🔑 **Key Terms:**
- Yield Optimization
- Impermanent Loss
- Auto-rebalancing
- Risk Management

💡 **Session Highlights:**
- Excellent preparation
- Thorough analysis
- Clear understanding
- Forward-thinking approach
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Smart Contract Security Audit
⏱️ Duration: 50 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Found any vulnerabilities in your audit?
Student: Several! Let me show you my findings.
Host: What tools did you use?
Student: Slither, Mythril, and manual review.
Host: Excellent approach! What's the highest risk?
Student: Found a potential reentrancy in the withdrawal function.
Host: How would you fix it?
Student: Already implemented checks-effects-interactions!
Host: Perfect! What other patterns concern you?
Student: I'm worried about front-running in the DEX integration.

📊 **Call Analysis Results**
⏱️ Duration: 50 minutes

👥 **Speaker Breakdown:**
- Instructor: 40%
- Student: 60%

📈 **Engagement Metrics:**
- Vulnerabilities Found: 8
- Tools Used: 3
- Fixes Implemented: 5

⭐ **Quality Score: 9.5/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Complete vulnerability fixes
- Add front-running protection
- Document security patterns
- Schedule follow-up audit

🔑 **Key Terms:**
- Reentrancy Protection
- Front-running Prevention
- Security Tools
- Audit Methodology

💡 **Session Highlights:**
- Thorough security review
- Proactive fixes
- Tool proficiency
- Strong security mindset
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Layer 2 Optimizations
⏱️ Duration: 45 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: How's the L2 migration progressing?
Student: *Joins late* Having compiler issues...
Host: Did you check the documentation?
Student: Which documentation?
Host: The one I sent last week...
Student: Oh... must have missed that.
Host: *Sighs* Let's start with setup basics.
Student: Everything's so confusing...

📊 **Call Analysis Results**
⏱️ Duration: 45 minutes

👥 **Speaker Breakdown:**
- Instructor: 80%
- Student: 20%

📈 **Engagement Metrics:**
- Setup Progress: Minimal
- Questions Asked: 3
- Issues Resolved: 1

⭐ **Quality Score: 4.0/10**
❌ Quality threshold not met

📋 **Action Items:**
- Review documentation
- Complete basic setup
- Resolve compiler issues
- Schedule environment check

🔑 **Key Terms:**
- L2 Migration
- Compiler Setup
- Environment Configuration

💡 **Session Concerns:**
- Poor preparation
- Documentation unread
- Basic setup incomplete
- Time management issues
`,
  `
📄 **Otter AI Transcript**
✅ Transcript for meeting: Zero Knowledge Proofs
⏱️ Duration: 60 minutes
🔍 Meeting ID: meeting_${faker.string.numeric(13)}_${faker.string.numeric(1)}

Host: Let's discuss your ZK-SNARK implementation.
Student: I've been studying the math foundations!
Host: Show me your circuit design.
Student: *Shares detailed diagrams and code*
Host: Very well thought out! How's the prover performance?
Student: Got it down to 3 seconds with optimization.
Host: Impressive! What's your next optimization target?
Student: Working on reducing witness size.
Host: Great direction! Any verification bottlenecks?
Student: Yes, identified three - already working on solutions.

📊 **Call Analysis Results**
⏱️ Duration: 60 minutes

👥 **Speaker Breakdown:**
- Instructor: 35%
- Student: 65%

📈 **Engagement Metrics:**
- Circuit Complexity: High
- Optimizations Found: 10
- Performance Improvements: 40%

⭐ **Quality Score: 9.9/10**
✅ Quality threshold exceeded!

📋 **Action Items:**
- Optimize witness generation
- Reduce verification time
- Document circuit design
- Prepare benchmarks

🔑 **Key Terms:**
- ZK-SNARKs
- Circuit Design
- Witness Generation
- Proof Optimization

💡 **Session Highlights:**
- Deep mathematical understanding
- Strong optimization skills
- Clear performance goals
- Excellent preparation
`,
];

// Convert conversation data to sessions
const initialSessions: Session[] = conversations.map((conv) => {
  const lines = conv.split("\n");
  const titleLine = lines.find((line) =>
    line.includes("Transcript for meeting:")
  );
  const title = titleLine ? titleLine.split(": ")[1] : "Untitled Session";
  const durationLine = lines.find((line) => line.includes("Duration:"));
  const duration = durationLine ? durationLine.split(": ")[1].trim() : "N/A";
  const scoreLine = lines.find((line) => line.includes("Quality Score:"));
  const score = scoreLine ? parseFloat(scoreLine.split(": ")[1]) : 0;

  // Generate a random speaking time between 35% and 60%
  const studentSpeaking = Math.floor(Math.random() * (60 - 35 + 1)) + 35;

  return {
    id: faker.string.uuid(),
    title,
    date: faker.date.recent({ days: 14 }).toLocaleDateString(),
    duration,
    qualityScore: score,
    status:
      score >= 9.0
        ? "pending_signature"
        : score >= 6.0
        ? "pending_signature"
        : "disputed",
    student: {
      speakingTime: studentSpeaking,
      engagement: score,
    },
    instructor: {
      speakingTime: 100 - studentSpeaking,
    },
  };
});

function getStatusColor(status: SessionStatus): string {
  switch (status) {
    case "disputed":
      return "text-red-500 bg-red-100";
    case "pending_signature":
      return "text-yellow-500 bg-yellow-100";
    case "executed":
      return "text-green-500 bg-green-100";
    case "paid":
      return "text-blue-500 bg-blue-100";
    default:
      return "text-gray-500 bg-gray-100";
  }
}

function SessionCard({
  session,
  onStatusChange,
}: {
  session: Session;
  onStatusChange: (id: string, status: SessionStatus) => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-bold">{session.title}</CardTitle>
          <CardDescription>
            {session.date} • {session.duration}
          </CardDescription>
        </div>
        <Select
          defaultValue={session.status}
          onValueChange={(value: SessionStatus) =>
            onStatusChange(session.id, value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disputed">Disputed</SelectItem>
            <SelectItem value="pending_signature">Pending Signature</SelectItem>
            <SelectItem value="executed">Executed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Student Speaking Time: {session.student.speakingTime.toString()}%
            </p>
            <p className="text-sm text-muted-foreground">
              Quality Score: {session.qualityScore.toFixed(1)}/10
            </p>
          </div>
          <Badge variant="secondary" className={getStatusColor(session.status)}>
            {session.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AgentDashboard() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [hasMounted, setHasMounted] = useState(false);

  const handleStatusChange = (id: string, newStatus: SessionStatus) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === id ? { ...session, status: newStatus } : session
      )
    );
  };

  const stats = {
    totalSessions: sessions.length,
    disputedSessions: sessions.filter((s) => s.status === "disputed").length,
    completedSessions: sessions.filter((s) =>
      ["executed", "paid"].includes(s.status)
    ).length,
    averageQualityScore:
      sessions.reduce((acc, s) => acc + s.qualityScore, 0) / sessions.length,
    averageStudentEngagement:
      sessions.reduce((acc, s) => acc + s.student.engagement, 0) /
      sessions.length,
  };

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    console.log(sessions);
  }, [hasMounted, sessions]);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Session Management</h1>
            <p className="text-gray-500">Manage and review tutoring sessions</p>
          </div>
          <div className="flex gap-4">
            <div className="text-sm">
              <p>Total Sessions: {stats.totalSessions}</p>
              <p>Disputed: {stats.disputedSessions}</p>
              <p>Completed: {stats.completedSessions}</p>
            </div>
            <Button variant="outline">Export Report</Button>
          </div>
        </div>

        <ScrollArea className="h-[800px] pr-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onStatusChange={handleStatusChange}
            />
          ))}
        </ScrollArea>
      </div>
    </main>
  );
}
