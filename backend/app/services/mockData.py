# Complete Python representations for Course, 50 Questions, and Notes
from typing import List, Dict, Any

MOCK_COURSE_DATA: Dict[str, Any] = {
    "id": "course-nptel-hpca-01",
    "title": "CS801: High-Performance Computer Architecture & Parallel Systems",
    "code": "CS801-NPTEL",
    "description": "Comprehensive NPTEL-style study program covering instruction-level parallelism, pipelining hazards, cache coherence protocols, and distributed memory architectures.",
    "totalWeeks": 4,
    "totalLectures": 16,
    "weeks": [
        {
            "id": "week-1",
            "courseId": "course-nptel-hpca-01",
            "weekNumber": 1,
            "title": "Pipelining, ILP, Hazards & Amdahl’s Law",
            "lecturesCount": 4,
            "documentsCount": 4,
            "hasNotes": True,
            "notesCoveragePercentage": 98.5,
            "validQuestionsCount": 50,
            "targetQuestionsCount": 50,
            "status": "ready",
            "lastUpdated": "2026-10-10T11:20:00Z"
        },
        {
            "id": "week-2",
            "courseId": "course-nptel-hpca-01",
            "weekNumber": 2,
            "title": "Memory Hierarchy, Cache Design & Replacement Policies",
            "lecturesCount": 4,
            "documentsCount": 4,
            "hasNotes": True,
            "notesCoveragePercentage": 96.0,
            "validQuestionsCount": 42,
            "targetQuestionsCount": 50,
            "shortageExplanation": "Lectures 7 and 8 contain brief introductory summaries. Only 42 valid, distinct questions could be strictly verified from uploaded slides without introducing external facts.",
            "status": "partial",
            "lastUpdated": "2026-10-11T09:15:00Z"
        },
        {
            "id": "week-3",
            "courseId": "course-nptel-hpca-01",
            "weekNumber": 3,
            "title": "Snooping vs Directory Cache Coherence (MESI / MOESI)",
            "lecturesCount": 4,
            "documentsCount": 4,
            "hasNotes": False,
            "notesCoveragePercentage": 0.0,
            "validQuestionsCount": 0,
            "targetQuestionsCount": 50,
            "status": "processing",
            "lastUpdated": "2026-10-12T06:00:00Z"
        },
        {
            "id": "week-4",
            "courseId": "course-nptel-hpca-01",
            "weekNumber": 4,
            "title": "Interconnection Networks, Topologies & Routing Protocols",
            "lecturesCount": 4,
            "documentsCount": 4,
            "hasNotes": False,
            "notesCoveragePercentage": 0.0,
            "validQuestionsCount": 0,
            "targetQuestionsCount": 50,
            "status": "unprocessed",
            "lastUpdated": "2026-10-12T06:00:00Z"
        }
    ]
}

# The 50 validated questions for Week 1
MOCK_WEEK1_QUESTIONS: List[Dict[str, Any]] = [
    # EASY (10 questions: 1 to 10)
    {
        "id": "q-w1-01", "questionNumber": 1, "type": "single_mcq", "difficulty": "easy",
        "questionText": "In a canonical 5-stage in-order RISC pipeline, which stage is responsible for reading the instruction from memory and incrementing the Program Counter (PC)?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "Instruction Fetch (IF)", "isCorrect": True, "explanation": "IF fetches the instruction and increments PC."},
            {"id": "opt-b", "label": "B", "text": "Instruction Decode (ID)", "isCorrect": False, "explanation": "ID decodes opcodes and reads registers."},
            {"id": "opt-c", "label": "C", "text": "Execute (EX)", "isCorrect": False, "explanation": "EX executes ALU operations."},
            {"id": "opt-d", "label": "D", "text": "Memory Access (MEM)", "isCorrect": False, "explanation": "MEM accesses data cache."}
        ],
        "correctOptionLabels": ["A"],
        "explanation": "According to Lecture 1, Slide 7, the IF stage reads the instruction from instruction memory and increments the PC by 4.",
        "conceptsTested": ["5-Stage RISC Pipeline", "Instruction Fetch"],
        "sourceReference": {"documentName": "Week1_Lecture01_Fundamentals_of_Pipelining.pdf", "lectureNumber": 1, "slideNumber": 7, "excerptSnippet": "Slide 7: IF Stage fetches instruction from IMEM and updates PC."}
    },
    {
        "id": "q-w1-02", "questionNumber": 2, "type": "single_mcq", "difficulty": "easy",
        "questionText": "What is the primary performance benefit of instruction pipelining in modern processors?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "It decreases the latency required to execute an individual instruction.", "isCorrect": False, "explanation": "Latency is unchanged or increased."},
            {"id": "opt-b", "label": "B", "text": "It increases instruction execution throughput across multiple instructions.", "isCorrect": True, "explanation": "Pipelining overlaps operations to increase throughput."},
            {"id": "opt-c", "label": "C", "text": "It reduces the physical silicon area required for the CPU datapath.", "isCorrect": False, "explanation": "Requires additional pipeline registers."},
            {"id": "opt-d", "label": "D", "text": "It eliminates the need for cache memory hierarchies.", "isCorrect": False, "explanation": "Incorrect."}
        ],
        "correctOptionLabels": ["B"],
        "explanation": "Lecture 1 Slide 14 emphasizes that pipelining does not reduce individual instruction latency, but dramatically increases instruction throughput.",
        "conceptsTested": ["Pipeline Throughput vs Latency"],
        "sourceReference": {"documentName": "Week1_Lecture01_Fundamentals_of_Pipelining.pdf", "lectureNumber": 1, "slideNumber": 14, "excerptSnippet": "Slide 14: Pipelining increases instruction throughput."}
    },
    {
        "id": "q-w1-03", "questionNumber": 3, "type": "single_mcq", "difficulty": "easy",
        "questionText": "Which category of hazard occurs when two instructions in the pipeline compete for the same physical hardware resource simultaneously?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "Data Hazard", "isCorrect": False, "explanation": "Data hazards arise from dependencies."},
            {"id": "opt-b", "label": "B", "text": "Structural Hazard", "isCorrect": True, "explanation": "Structural hazards arise from resource conflicts."},
            {"id": "opt-c", "label": "C", "text": "Control Hazard", "isCorrect": False, "explanation": "Control hazards arise from branches."},
            {"id": "opt-d", "label": "D", "text": "Temporal Hazard", "isCorrect": False, "explanation": "Not a standard term."}
        ],
        "correctOptionLabels": ["B"],
        "explanation": "Lecture 1 Slide 21 defines a Structural Hazard as a situation where hardware resource limitations prevent simultaneous execution.",
        "conceptsTested": ["Structural Hazards"],
        "sourceReference": {"documentName": "Week1_Lecture01_Fundamentals_of_Pipelining.pdf", "lectureNumber": 1, "slideNumber": 21, "excerptSnippet": "Slide 21: Structural Hazard: Attempting to use the same hardware resource simultaneously."}
    },
    {
        "id": "q-w1-04", "questionNumber": 4, "type": "single_mcq", "difficulty": "easy",
        "questionText": "Which type of data dependency is known as a 'true data dependency'?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "Read-After-Write (RAW)", "isCorrect": True, "explanation": "RAW represents genuine data flow dependency."},
            {"id": "opt-b", "label": "B", "text": "Write-After-Read (WAR)", "isCorrect": False, "explanation": "WAR is an anti-dependency."},
            {"id": "opt-c", "label": "C", "text": "Write-After-Write (WAW)", "isCorrect": False, "explanation": "WAW is an output dependency."},
            {"id": "opt-d", "label": "D", "text": "Read-After-Read (RAR)", "isCorrect": False, "explanation": "RAR is not a hazard."}
        ],
        "correctOptionLabels": ["A"],
        "explanation": "Lecture 2 Slide 8 defines RAW (Read-After-Write) as the genuine data dependency because consumer needs producer's value.",
        "conceptsTested": ["RAW True Data Dependency"],
        "sourceReference": {"documentName": "Week1_Lecture02_Hazards_and_Forwarding.pptx", "lectureNumber": 2, "slideNumber": 8, "excerptSnippet": "Slide 8: RAW is a true data dependency."}
    },
    {
        "id": "q-w1-05", "questionNumber": 5, "type": "single_mcq", "difficulty": "easy",
        "questionText": "What hardware technique is employed to deliver ALU results directly to the input of dependent instructions without waiting for register Write-Back?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "Operand Forwarding (Bypassing)", "isCorrect": True, "explanation": "Forwarding routes data directly from pipeline registers into ALU inputs."},
            {"id": "opt-b", "label": "B", "text": "Branch Prediction", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-c", "label": "C", "text": "Speculative Execution", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-d", "label": "D", "text": "Register Renaming", "isCorrect": False, "explanation": "Incorrect."}
        ],
        "correctOptionLabels": ["A"],
        "explanation": "Lecture 2 Slide 18 discusses forwarding/bypassing, which retrieves results from EX/MEM or MEM/WB pipeline registers.",
        "conceptsTested": ["Operand Forwarding / Bypassing"],
        "sourceReference": {"documentName": "Week1_Lecture02_Hazards_and_Forwarding.pptx", "lectureNumber": 2, "slideNumber": 18, "excerptSnippet": "Slide 18: Forwarding provides inputs directly to EX stage."}
    },
    {
        "id": "q-w1-06", "questionNumber": 6, "type": "single_mcq", "difficulty": "easy",
        "questionText": "According to Amdahl’s Law, if 40% of a program is strictly sequential (1 - p = 0.40), what is the maximum speedup possible with infinite parallel processors?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "2.5", "isCorrect": True, "explanation": "Speedup as N approaches infinity is 1 / 0.40 = 2.5."},
            {"id": "opt-b", "label": "B", "text": "4.0", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-c", "label": "C", "text": "10.0", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-d", "label": "D", "text": "Infinity", "isCorrect": False, "explanation": "Capped by sequential portion."}
        ],
        "correctOptionLabels": ["A"],
        "explanation": "From Lecture 3 Slide 16: Speedup ceiling = 1 / (1 - p) = 1 / 0.40 = 2.5.",
        "conceptsTested": ["Amdahl’s Law Theoretical Ceiling"],
        "sourceReference": {"documentName": "Week1_Lecture03_Amdahls_Law_and_Speedup.pdf", "lectureNumber": 3, "slideNumber": 16, "excerptSnippet": "Slide 16: Max Speedup as N -> infinity is 1 / (1 - p)."}
    },
    {
        "id": "q-w1-07", "questionNumber": 7, "type": "single_mcq", "difficulty": "easy",
        "questionText": "How many mispredictions in the opposite direction are required to change the prediction of a 2-bit saturating counter in 'Strongly Taken' state?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "1", "isCorrect": False, "explanation": "Moves state from 11 to 10."},
            {"id": "opt-b", "label": "B", "text": "2", "isCorrect": True, "explanation": "Two consecutive Not Taken outcomes transition it to Weakly Not Taken (01)."},
            {"id": "opt-c", "label": "C", "text": "3", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-d", "label": "D", "text": "4", "isCorrect": False, "explanation": "Incorrect."}
        ],
        "correctOptionLabels": ["B"],
        "explanation": "Lecture 4 Slide 16 notes that a 2-bit counter has hysteresis, requiring two successive mispredictions to alter the binary prediction outcome.",
        "conceptsTested": ["2-bit Saturating Counter Hysteresis"],
        "sourceReference": {"documentName": "Week1_Lecture04_Dynamic_Branch_Prediction.docx", "lectureNumber": 4, "slideNumber": 16, "excerptSnippet": "Slide 16: Two consecutive unexpected outcomes change prediction."}
    },
    {
        "id": "q-w1-08", "questionNumber": 8, "type": "single_mcq", "difficulty": "easy",
        "questionText": "What structure is used to store target addresses of predicted branches so they can be fetched without delay in the IF stage?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "Branch Target Buffer (BTB)", "isCorrect": True, "explanation": "Caches target addresses indexed by PC."},
            {"id": "opt-b", "label": "B", "text": "Translation Lookaside Buffer (TLB)", "isCorrect": False, "explanation": "Virtual memory."},
            {"id": "opt-c", "label": "C", "text": "Instruction Queue", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-d", "label": "D", "text": "Reorder Buffer (ROB)", "isCorrect": False, "explanation": "Out-of-order retirement."}
        ],
        "correctOptionLabels": ["A"],
        "explanation": "Lecture 4 Slide 27: A BTB stores target addresses alongside the PC to allow zero-delay fetching in the IF stage.",
        "conceptsTested": ["Branch Target Buffer"],
        "sourceReference": {"documentName": "Week1_Lecture04_Dynamic_Branch_Prediction.docx", "lectureNumber": 4, "slideNumber": 27, "excerptSnippet": "Slide 27: BTB stores the branch target address."}
    },
    {
        "id": "q-w1-09", "questionNumber": 9, "type": "single_mcq", "difficulty": "easy",
        "questionText": "In a 5-stage pipeline without branch hardware in the ID stage, where is the branch condition traditionally computed in the datapath?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "Instruction Fetch (IF) stage", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-b", "label": "B", "text": "Execution (EX) stage", "isCorrect": True, "explanation": "ALU in EX compares register values."},
            {"id": "opt-c", "label": "C", "text": "Memory Access (MEM) stage", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-d", "label": "D", "text": "Write Back (WB) stage", "isCorrect": False, "explanation": "Incorrect."}
        ],
        "correctOptionLabels": ["B"],
        "explanation": "Lecture 2 Slide 33: By default, the ALU in EX compares registers, causing 3 stall cycles unless branch resolution is moved to ID.",
        "conceptsTested": ["Branch Condition Evaluation"],
        "sourceReference": {"documentName": "Week1_Lecture02_Hazards_and_Forwarding.pptx", "lectureNumber": 2, "slideNumber": 33, "excerptSnippet": "Slide 33: Branch outcome is computed by ALU in EX stage."}
    },
    {
        "id": "q-w1-10", "questionNumber": 10, "type": "single_mcq", "difficulty": "easy",
        "questionText": "What is the ideal Cycles Per Instruction (CPI) of an in-order scalar pipeline in the absence of hazards and stalls?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "0.5", "isCorrect": False, "explanation": "Superscalar."},
            {"id": "opt-b", "label": "B", "text": "1.0", "isCorrect": True, "explanation": "One instruction completes per cycle."},
            {"id": "opt-c", "label": "C", "text": "5.0", "isCorrect": False, "explanation": "Latency, not CPI."},
            {"id": "opt-d", "label": "D", "text": "Equal to stage count k", "isCorrect": False, "explanation": "Incorrect."}
        ],
        "correctOptionLabels": ["B"],
        "explanation": "Lecture 1 Slide 15: Ideal CPI = 1 for a single-issue scalar pipelined processor in steady state.",
        "conceptsTested": ["Ideal Pipeline CPI"],
        "sourceReference": {"documentName": "Week1_Lecture01_Fundamentals_of_Pipelining.pdf", "lectureNumber": 1, "slideNumber": 15, "excerptSnippet": "Slide 15: Ideal CPI = 1 for single-issue scalar pipeline."}
    },
]

# Dynamically populate Medium (Q11-Q35) and Advanced (Q36-Q50) to guarantee all 50 items
for i in range(11, 36):
    is_num = (i == 15 or i == 20)
    is_multi = (i == 12 or i == 16 or i == 24)
    q_type = "numerical" if is_num else ("multi_mcq" if is_multi else "single_mcq")
    
    q_item: Dict[str, Any] = {
        "id": f"q-w1-{i:02d}",
        "questionNumber": i,
        "type": q_type,
        "difficulty": "medium",
        "questionText": f"Question {i}: Consider pipeline scheduling and hazard mitigation in Week 1. When an instruction sequence has distance {i % 3 + 1} dependency, which forwarding path resolves it?",
        "options": [
            {"id": "opt-a", "label": "A", "text": "EX/MEM to EX stage ALU input", "isCorrect": True, "explanation": "Handles distance-1 hazards."},
            {"id": "opt-b", "label": "B", "text": "MEM/WB to EX stage ALU input", "isCorrect": False, "explanation": "Handles distance-2 hazards."},
            {"id": "opt-c", "label": "C", "text": "Hardware stall injection", "isCorrect": False, "explanation": "Forwarding eliminates stalls."},
            {"id": "opt-d", "label": "D", "text": "Branch prediction redirect", "isCorrect": False, "explanation": "Unrelated."}
        ],
        "correctOptionLabels": ["A"],
        "explanation": f"Based on Lecture 2 Slide 21: Forwarding paths from EX/MEM and MEM/WB resolve ALU-to-ALU dependencies.",
        "conceptsTested": ["Hazard Resolution", "Forwarding Datapaths"],
        "sourceReference": {
            "documentName": "Week1_Lecture02_Hazards_and_Forwarding.pptx",
            "lectureNumber": 2,
            "slideNumber": 21,
            "excerptSnippet": "Slide 21: Forwarding from EX/MEM handles distance-1 dependencies."
        }
    }
    if is_num:
        q_item["questionText"] = f"Question {i}: Calculate the speedup under Amdahl's Law for a workload that is 75% parallelized running on {i - 9} cores."
        q_item["expectedNumericalValue"] = round(1.0 / ((1 - 0.75) + 0.75 / (i - 9)), 2)
        q_item["numericalTolerance"] = 0.05
        q_item["numericalUnit"] = "x"
        q_item["deterministicCalculation"] = f"1.0 / (0.25 + 0.75 / {i - 9})"
        q_item["options"] = None
        q_item["correctOptionLabels"] = None
    elif is_multi:
        q_item["correctOptionLabels"] = ["A", "B"]
        q_item["options"][1]["isCorrect"] = True

    MOCK_WEEK1_QUESTIONS.append(q_item)

for i in range(36, 51):
    is_num = (i == 36 or i == 38 or i == 41 or i == 44 or i == 47 or i == 50)
    is_multi = (i == 37 or i == 43)
    q_type = "numerical" if is_num else ("multi_mcq" if is_multi else "single_mcq")

    q_item = {
        "id": f"q-w1-{i:02d}",
        "questionNumber": i,
        "type": q_type,
        "difficulty": "advanced",
        "questionText": f"Question {i}: In a deep superscalar processor architecture, analyze branch misprediction penalties and state recovery.",
        "options": [
            {"id": "opt-a", "label": "A", "text": "All speculative instructions in the wrong path must be flushed from pipeline registers.", "isCorrect": True, "explanation": "Flushing prevents incorrect execution."},
            {"id": "opt-b", "label": "B", "text": "Predictor branch history table entries must be updated with actual outcome.", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-c", "label": "C", "text": "Execution time scales inversely with pipeline depth.", "isCorrect": False, "explanation": "Incorrect."},
            {"id": "opt-d", "label": "D", "text": "Amdahl speedup becomes unbounded.", "isCorrect": False, "explanation": "Incorrect."}
        ],
        "correctOptionLabels": ["A"],
        "explanation": f"Based on Lecture 4 Slide 35: Deep pipelines require flushing wrong-path instructions upon branch misprediction.",
        "conceptsTested": ["Deep Pipelines", "Branch Misprediction Penalties"],
        "sourceReference": {
            "documentName": "Week1_Lecture04_Dynamic_Branch_Prediction.docx",
            "lectureNumber": 4,
            "slideNumber": 35,
            "excerptSnippet": "Slide 35: Misprediction requires pipeline flush and architectural rollback."
        }
    }
    if is_num:
        q_item["questionText"] = f"Question {i}: Using Amdahl's Law, what parallel fraction p is required to achieve {i - 32}x speedup on 16 cores?"
        q_item["expectedNumericalValue"] = round((1.0 - 1.0 / (i - 32)) / (1.0 - 1.0 / 16.0), 2)
        q_item["numericalTolerance"] = 0.05
        q_item["numericalUnit"] = "fraction"
        q_item["deterministicCalculation"] = f"(1.0 - 1.0 / {i - 32}) / (1.0 - 1.0 / 16.0)"
        q_item["options"] = None
        q_item["correctOptionLabels"] = None
    elif is_multi:
        q_item["correctOptionLabels"] = ["A", "B"]
        q_item["options"][1]["isCorrect"] = True

    MOCK_WEEK1_QUESTIONS.append(q_item)
