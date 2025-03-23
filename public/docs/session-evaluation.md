# TutorChain Session Quality Assessment System

## Input Analysis Instructions

1. Analyze the Otter AI transcript including:

   - Conversation between participants
   - Session duration
   - Call analysis results
   - Speaker breakdown
   - Engagement metrics
   - Quality score provided by analytics

2. Look for key indicators:
   - Student comprehension statements ("I understand now", "This makes sense")
   - Level of preparation by both parties
   - Balance of speaking time (ideal: student 50-60%)
   - Completion of planned topics
   - Questions asked and concepts covered

## Quality Rating Scale

| Rating      | Description  | Base Distribution (Mentor-Mentee-Agent-Platform) |
| ----------- | ------------ | ------------------------------------------------ |
| ★★★★★ (5.0) | Exceptional  | 90%-5%-2.5%-2.5%                                 |
| ★★★★☆ (4.0) | Very Good    | 70%-25%-2.5%-2.5%                                |
| ★★★☆☆ (3.0) | Satisfactory | 50%-45%-2.5%-2.5%                                |
| ★★☆☆☆ (2.0) | Substandard  | 30%-65%-2.5%-2.5%                                |
| ★☆☆☆☆ (1.0) | Poor         | 10%-85%-2.5%-2.5%                                |
| ☆☆☆☆☆ (0.0) | Unacceptable | 0%-90%-5%-5%                                     |

## Simple Evaluation Guidelines

### High-Quality Indicators (★★★★★ to ★★★★☆)

- Student speaking time 50%+ of session
- Clear comprehension statements from student
- Evidence of preparation by both parties
- Engagement metrics showing 8+ concepts covered
- Analytics quality score 9.0+/10
- Positive session highlights noted
- Completion of planned topics

### Medium-Quality Indicators (★★★☆☆)

- Student speaking time 40-50% of session
- Some understanding demonstrated
- Basic preparation shown
- Engagement metrics showing 5-7 concepts covered
- Analytics quality score 6.0-8.9/10
- Mixed session highlights and concerns
- Partial completion of planned topics

### Low-Quality Indicators (★★☆☆☆ to ☆☆☆☆☆)

- Student speaking time below 30% of session
- Confusion or frustration expressed
- Lack of preparation
- Engagement metrics showing < 5 concepts covered
- Analytics quality score below 6.0/10
- Session concerns noted
- Few or no topics completed
- Late arrival or technical issues disrupting session

## Verdict Template

```
# Session Quality Assessment

## Session Details
- Topic: [Topic]
- Duration: [Duration]

## Quality Rating: [★★★☆☆] (3.0/5.0)

### Key Evidence
- [3-5 specific quotes or metrics from transcript]

### Payment Distribution
- Mentor: [Percentage]%
- Mentee: [Percentage]%
- Agent: 2.5%
- Platform: 2.5%

### Justification
[1-2 sentences explaining the rating]

## Resolution Timeline
Both parties have 3 days to approve this verdict.
```

## Example Interpretations from Sample Data

### High-Quality Example (Smart Contract Development Session)

- Student engagement signals: "This is actually fun", "I'm finally understanding!"
- Speaking balance: Student 55%, Mentor 45%
- Analytics quality score: 9.2/10
- Clear progression through concepts
- Action items assigned for continued learning
- Rating: ★★★★★ (5.0/5.0)

### Low-Quality Example (MEV Protection Strategies)

- Student lack of preparation: "No... what's flashbots?"
- Poor speaking balance: Student 15%, Mentor 85%
- Analytics quality score: 3.8/10
- Only 1 concept covered
- Session concerns noted
- Rating: ★☆☆☆☆ (1.0/5.0)

For each session transcript, identify these key indicators and determine the appropriate quality rating, then calculate the payment distribution accordingly.
