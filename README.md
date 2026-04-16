# Knowledge Graph to Natural Language Generation

## Fine-Tuning Gemma-1.1-2B-IT with LoRA and QLoRA on DrugBank

This project investigates Knowledge Graph to Natural Language Generation (KG-to-Text) using a Small Language Model (SLM). The system converts structured pharmaceutical knowledge graph triples into fluent natural language descriptions.

The project was developed as part of the UEL – Depixen collaboration exploring domain-aligned AI systems trained on verified data sources.


# Project Overview

Knowledge graphs contain structured semantic relationships that are easily interpreted by machines but difficult for humans to read directly. This project focuses on translating these structured representations into natural language using a fine-tuned language model.

The project pipeline includes:
	•	domain selection
	•	dataset extraction and preparation
	•	ontology design
	•	RDF triple generation
	•	KG-to-Text dataset creation
	•	fine-tuning Gemma-1.1-2B-IT
	•	evaluation using multiple metrics
	•	model deployment and inference interface

The final system takes DrugBank RDF triples as input and generates readable drug descriptions.

# Domain Selection

Domain: Healthcare / Pharmaceutical Knowledge Graphs

The healthcare domain was selected because it contains highly structured and knowledge-rich datasets, making it suitable for ontology modeling and RDF triple representation.

Reasons for selecting this domain:
	•	strong alignment with verified data sources
	•	high importance of factual accuracy
	•	ideal for ontology design and semantic relationships
	•	well suited for Knowledge Graph to Text generation
	•	aligns with Depixen’s focus on trustworthy AI systems


# Dataset

DrugBank Dataset

Dataset source
https://go.drugbank.com/releases/latest
DrugBank is a comprehensive pharmaceutical database that provides structured information about drugs, including their chemical properties, medical uses, and mechanisms of action.
The selected fields include:
| Field | Description |
|------|-------------|
| drugbank_id | Unique identifier for each drug |
| name | Drug name |
| groups | Drug classification group |
| synonyms | Alternative names for the drug |
| state | Physical state of the drug |
| description | General background description |
| indication | Medical conditions the drug treats |
| mechanism_of_action | How the drug works pharmacologically |
| unii | FDA unique ingredient identifier |
| cas_number | Chemical registry number |
| average_mass | Average molecular mass |
| monoisotopic_mass | Exact molecular mass |

# Dataset Access Policy

The dataset was downloaded using a student account with a university research licence.

Important restrictions:
	•	The DrugBank dataset must not be shared publicly.
	•	Data must remain within the organisation or project team.
	•	It is used strictly for academic research purposes.

# Dataset Preparation Pipeline

The dataset preparation process consisted of the following stages.

1 XML Parsing

The DrugBank XML file was parsed to extract structured drug information.

2 Field Extraction

Relevant fields were extracted and converted into a tabular dataset.

3 Data Cleaning

Cleaning steps included:
	•	removing null values
	•	trimming text fields
	•	standardizing identifiers
	•	limiting synonyms
	•	removing duplicates

Final clean dataset size:

2540 rows
12 selected fields

# Ontology Design

An RDF ontology was designed to represent drug entities and their properties.
| Predicate | Meaning |
|----------|--------|
| rdf:type | Entity class |
| hasName | Drug name |
| hasDrugBankID | Unique identifier |
| hasSynonym | Alternative drug name |
| hasGroup | Drug classification group |
| hasState | Physical state |
| hasDescription | Drug description |
| hasIndication | Medical use |
| hasMechanismOfAction | Pharmacological mechanism |
| hasUNII | FDA identifier |
| hasCASNumber | Chemical registry number |
| hasAverageMass | Molecular mass |
| hasMonoisotopicMass | Exact molecular mass |

Total ontology triples: 51

# KG-to-Text Dataset Creation

RDF triples were transformed into instruction-based training samples.
Each sample includes:
Instruction, input, output and drugbank id.
#Dataset statistics:

Total samples: 2537

Average input word count: 94.32

Average output word count: 117.78

# Train / Validation / Test Split

The dataset was split to ensure fair evaluation.
| Dataset Split | Number of Samples |
|--------------|------------------|
| Train | 2029 |
| Validation | 254 |
| Test | 254 |

Quality checks ensured:
	•	no duplicate drug IDs
	•	no train/test overlap
	•	no missing predicates
	•	no null values

# Model Selection

Base model used:

Gemma-1.1-2B-IT

Gemma is a lightweight instruction-tuned language model developed by Google.

Reasons for selecting Gemma:
	•	efficient small language model
	•	suitable for parameter-efficient fine-tuning
	•	strong instruction-following ability
	•	good balance between performance and compute cost

# Fine-Tuning Methods

Two parameter-efficient techniques were evaluated.

# LoRA (Low Rank Adaptation)

LoRA freezes the base model weights and trains small low-rank matrices added to specific layers.

Advantages:
	•	efficient training
	•	low memory requirements
	•	stable optimization

Trainable parameters:

19,611,648
Total parameters:

2,525,784,064

Trainable percentage:

0.7765%

# QLoRA (Quantized LoRA)

QLoRA loads the base model using 4-bit quantization and then trains LoRA adapters.

Advantages:
	•	significantly lower GPU memory usage
	•	enables large model training on limited hardware

# Evaluation Metrics

Model performance was evaluated using multiple metrics.

Text similarity metrics
	•	BLEU
	•	ROUGE-1
	•	ROUGE-2
	•	ROUGE-L

Semantic similarity metric
	•	BERTScore

Factual consistency metrics
	•	fact precision
	•	fact recall
	•	fact F1
	•	hallucination rate

Additional checks
	•	exact match rate
	•	output length comparison
	•	train/test overlap detection

# Results

# LoRA Results

BLEU: 0.9737

ROUGE-1: 0.9938

ROUGE-2: 0.9802

ROUGE-L: 0.8574

BERTScore F1: 0.9896

Fact Precision: 0.9946

Fact Recall: 0.9994

Fact F1: 0.9966

Hallucination Rate: 0.00537

Exact Match Rate: 0.2677

# QLoRA Results

BLEU: 0.9764

ROUGE-1: 0.9947

ROUGE-2: 0.9809

ROUGE-L: 0.8603

BERTScore F1: 0.9901

Fact Precision: 0.9946

Fact Recall: 0.9994

Fact F1: 0.9966

Hallucination Rate: 0.00537

Exact Match Rate: 0.2717

# Model Comparison

| Metric | LoRA | QLoRA |
|------|------|------|
| Training Loss | 0.03548 | 0.03576 |
| BLEU | 0.9737 | 0.9764 |
| ROUGE-1 | 0.9938 | 0.9947 |
| ROUGE-2 | 0.9802 | 0.9809 |
| ROUGE-L | 0.8574 | 0.8603 |
| BERTScore F1 | 0.9896 | 0.9901 |
| Fact Precision | 0.9946 | 0.9946 |
| Fact Recall | 0.9994 | 0.9994 |
| Fact F1 | 0.9966 | 0.9966 |
| Hallucination Rate | 0.00537 | 0.00537 |
| Exact Match Rate | 0.2677 | 0.2717 |

Both LoRA and QLoRA achieved very strong performance with minimal differences.

Observations:
	•	QLoRA slightly improved text generation metrics
	•	LoRA achieved slightly lower training loss

Final preferred model: LoRA

because of slightly more stable optimization behavior.

# Hugging Face Repositories

## Dataset Repository

https://huggingface.co/datasets/BSVGK/drugbank_dataset

Contains:

	•	KG-to-Text dataset
	
	•	train / validation / test splits
	
	•	instruction formatted samples

## LoRA Adapter Model

https://huggingface.co/BSVGK/gemma-1.1-2b-it-drugbank-kg2text-lora-v2


## Merged Model (Recommended for inference)

https://huggingface.co/BSVGK/gemma-1.1-2b-it-drugbank-kg2text-merged-v2


# Interface Implementation

Two inference interfaces were built.

Gradio Demo

Used for interactive model testing.

Features:

	•	input RDF triples
	
	•	generate natural language output

# Local Web Deployment

Technology stack:

React
FastAPI
MongoDB
JavaScript

Architecture:

User → React UI → FastAPI → Gemma Model → Generated Text

# Limitations
•	The model was trained on a limited set of RDF predicates from the DrugBank ontology, which may restrict generalization to other   knowledge graph schemas.

	•	Most training samples contain a similar number of triples (around 13–17), so the model has limited exposure to cases with very small or very large triple sets.
	
	•	The dataset follows a relatively consistent output paragraph structure, which may lead the model to generate similar sentence patterns.
	
	•	The training data uses fixed triple ordering in many samples, which may introduce ordering bias in generated text.
	
	•	The dataset size (~2537 samples) is relatively small for training large language models, which may limit robustness.
	
	•	The project is focused on a single domain (DrugBank pharmaceutical data), so performance on other domains has not been evaluated.
	
	•	The model evaluation primarily relies on automated metrics, and extensive human evaluation by domain experts was not conducted.
	
	•	Some minor hallucinations may still occur, even though the hallucination rate is very low.

# Future Work
	•	Train the model with more diverse triples and additional predicates.
	•	Introduce multiple output sentence structures to improve linguistic diversity.
	•	Shuffle triple order during training to reduce structural bias.
	•	Train with datasets containing wider triple count variations.
	•	Increase dataset size through data augmentation or additional knowledge graph sources.
	•	Evaluate performance on multiple domains beyond pharmaceuticals.

# Acknowledgements

University of East London

Depixen Collaboration

DrugBank

Hugging Face

Google Gemma

# License

Dataset access governed by DrugBank research license.

Code provided for academic research purposes.







