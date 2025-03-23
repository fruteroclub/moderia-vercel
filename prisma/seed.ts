import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Add this at the top with your other helpers
async function generateMockTranscript() {
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
  ];

  return faker.helpers.arrayElement(conversations).trim();
}

async function main() {
  // First, fetch all services
  const services = await prisma.service.findMany();

  // Then iterate over them
  for (const service of services) {
    if (service.status === "completed") {
      await prisma.transcript.create({
        data: {
          ...(Math.random() > 0.5 && {
            transcriptUrl: faker.internet.url({ protocol: "https" }),
          }),
          content: await generateMockTranscript(),
          serviceId: service.id,
        },
      });
    }
  }
}

// Add this at the end of the file
main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding completed successfully");
  })
  .catch(async (e) => {
    console.error("Error seeding the database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
