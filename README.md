# 💊 KG-to-Text SLM — Pharmaceutical Knowledge Graph to Natural Language Generation

> **Fine-tuning Gemma 1.1 2B IT with LoRA and QLoRA on verified DrugBank pharmaceutical data to generate accurate, hallucination-free drug descriptions from structured RDF triples.**

[![HuggingFace](https://img.shields.io/badge/🤗%20HuggingFace-BSVGK-blue)](https://huggingface.co/BSVGK)
[![Dataset](https://img.shields.io/badge/Dataset-drugbank__dataset-green)](https://huggingface.co/datasets/BSVGK/drugbank_dataset)
[![Model](https://img.shields.io/badge/Model-gemma--1.1--2b--it--drugbank--kg2text--merged--v2-orange)](https://huggingface.co/BSVGK/gemma-1.1-2b-it-drugbank-kg2text-merged-v2)
[![License](https://img.shields.io/badge/License-Apache%202.0-yellow)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://python.org)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Results](#-results)
- [Repository Structure](#-repository-structure)
- [Dataset](#-dataset)
- [Model Architecture](#-model-architecture)
- [Fine-Tuning Methods](#-fine-tuning-methods)
- [Training Configuration](#-training-configuration)
- [Evaluation Metrics](#-evaluation-metrics)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Inference](#-inference)
- [Gradio Demo](#-gradio-demo)
- [HuggingFace Links](#-huggingface-links)
- [Project Team](#-project-team)
- [Citation](#-citation)

---

## 🔬 Project Overview

This project is part of the **UEL–Depixen Industrial Placement (January – May 2026)**, investigating the thesis:

> *A Small Language Model fine-tuned on verified, domain-specific data outperforms a large general-purpose LLM on targeted tasks — with dramatically lower hallucination.*

**Task:** Knowledge Graph to Text (KG-to-Text)  
**Domain:** Pharmaceutical / DrugBank  
**Input:** Structured RDF triples describing a pharmaceutical drug  
**Output:** Fluent, accurate, hallucination-free natural language description  

### Example

**Input RDF Triples:**
```
(DB00945, rdf:type, Drug)
(DB00945, hasName, Aspirin)
(DB00945, hasIndication, Treatment of mild to moderate pain)
(DB00945, hasMechanismOfAction, Inhibition of cyclooxygenase enzymes)
(DB00945, hasGroup, approved)
(DB00945, hasState, solid)
```

**Generated Output:**
```
Aspirin is an approved solid pharmaceutical compound primarily indicated for the 
treatment of mild to moderate pain. It exerts its therapeutic effect through 
inhibition of cyclooxygenase enzymes, which reduces the synthesis of prostaglandins 
involved in pain, fever and inflammation.
```

---

## 📊 Results

### LoRA vs QLoRA — Full Comparison (254 test samples)

| Metric | LoRA (Selected) | QLoRA (Compared) |
|--------|:--------------:|:----------------:|
| **BLEU** | **0.9737** | 0.9764 |
| **ROUGE-1** | **0.9938** | 0.9947 |
| **ROUGE-2** | **0.9802** | 0.9809 |
| **ROUGE-L** | **0.8574** | 0.8603 |
| **BERTScore F1** | **0.9896** | 0.9901 |
| **Fact Precision** | **0.9946** | 0.9946 |
| **Fact Recall** | **0.9994** | 0.9994 |
| **Fact F1** | **0.9966** | 0.9966 |
| **Exact Match Rate** | 0.2677 | 0.2717 |
| **Training Loss** | **0.03548** | 0.03576 |
| **Hallucination Rate** | **0.00537** | **0.00537** |

> ✅ **LoRA selected for deployment** — lower training loss (0.03548), more stable optimisation.  
> 🔑 **Key finding:** LoRA and QLoRA produce **identical hallucination rates** — quantisation does NOT affect hallucination in generation tasks.

---

## 📁 Repository Structure

```
kg-to-text-slm-project/
│
├── notebooks/
│   ├── KG2Text_LoRA.ipynb          # LoRA fine-tuning pipeline (selected model)
│   ├── KG2Text_QLoRA.ipynb         # QLoRA fine-tuning pipeline (comparison)
│   ├── Evaluation.ipynb            # Full evaluation on test set — all 8 metrics
│   └── Deployment.ipynb            # Model merging, HuggingFace upload, Gradio demo
│
├── app/
│   ├── frontend/                   # React web application frontend
│   ├── backend/                    # FastAPI backend
│   └── requirements.txt
│
├── data/
│   └── sample_triples.json         # Sample input triples for testing
│
├── scripts/
│   ├── prepare_dataset.py          # DrugBank XML → instruction-formatted dataset
│   ├── evaluate.py                 # Standalone evaluation script
│   └── inference.py               # CLI inference script
│
├── requirements.txt
├── LICENSE
└── README.md
```

---

## 📦 Dataset

### Source

**DrugBank** — [go.drugbank.com/releases/latest](https://go.drugbank.com/releases/latest)  
Access via university research licence. DrugBank is the pharmaceutical community's peer-reviewed gold standard database.

### Statistics

| Split | Samples | Percentage |
|-------|:-------:|:----------:|
| Training | 2,029 | 80% |
| Validation | 254 | 10% |
| Test | 254 | 10% |
| **Total** | **2,537** | **100%** |

### Ontology — 13-Predicate RDF Pharmaceutical Schema

| Predicate | Description |
|-----------|-------------|
| `rdf:type` | Classifies entity as Drug instance |
| `hasName` | Primary approved drug name |
| `hasDrugBankID` | Unique DrugBank identifier (e.g., DB00132) |
| `hasSynonym` | Alternative and trade names |
| `hasGroup` | Pharmaceutical classification (approved, experimental, nutraceutical) |
| `hasState` | Physical state (solid, liquid, gas) |
| `hasDescription` | General compound description |
| `hasIndication` | Clinical therapeutic uses |
| `hasMechanismOfAction` | Pharmacological mechanism |
| `hasUNII` | FDA Unique Ingredient Identifier |
| `hasCASNumber` | Chemical Abstracts Service registry number |
| `hasAverageMass` | Average molecular mass in Daltons |
| `hasMonoisotopicMass` | Monoisotopic molecular mass |

### Quality Validation

- ✅ No duplicate DrugBank IDs
- ✅ No train-test contamination
- ✅ No null values across all 12 extracted fields
- ✅ All 13 predicates present in every sample

### HuggingFace Dataset

```python
from datasets import load_dataset
dataset = load_dataset("BSVGK/drugbank_dataset")
```

🔗 [BSVGK/drugbank_dataset](https://huggingface.co/datasets/BSVGK/drugbank_dataset)

---

## 🧠 Model Architecture

**Base Model:** Gemma 1.1 2B IT — Google DeepMind  
**Parameters:** 2,525,784,064  
**Attention:** Global multi-head attention across all layers  
**Format:** Instruction-tuned

### Why Gemma 1.1 2B IT?

| Reason | Justification |
|--------|---------------|
| **2B parameters** | Compact enough for efficient fine-tuning (<30 min on A100). Validates Depixen's thesis that data quality beats model size. |
| **Instruction-tuned** | Already aligned with task formatting — reduces training time required for task adaptation. |
| **Global attention** | Every input token attends to every other token — all pharmaceutical facts simultaneously accessible during generation. |
| **Open access** | Full reproducibility, well-documented, community-tested base. |

---

## ⚙️ Fine-Tuning Methods

### LoRA (Low-Rank Adaptation) — **Selected for Deployment**

| Parameter | Value | Justification |
|-----------|:-----:|---------------|
| Rank `r` | 16 | Community standard for domain fine-tuning. Balances capacity vs memory. |
| Alpha `α` | 32 | Ratio 2.0 — proven stable scaling for instruction-tuned transformers. |
| Dropout | 0.05 | Light regularisation on adapter matrices. Prevents overfitting on 2,537 samples. |
| Target modules | 7 | `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj` |
| Trainable params | 19.6M (0.78%) | Base model frozen. Only LoRA matrices A and B update. |
| Precision | float16 | Full precision — no quantisation. Maximum factual grounding. |
| Training loss | 0.03548 | Lower than QLoRA → more stable convergence. |

### QLoRA (Quantised LoRA) — Comparison

Same LoRA configuration plus:

| Setting | Value | Justification |
|---------|:-----:|---------------|
| Base model quantisation | 4-bit NF4 | Reduces base model from ~4.5 GB to ~1.2 GB. NF4 preserves weight distribution. |
| Compute dtype | bfloat16 | Wider dynamic range — avoids overflow during backward pass on A100. |
| Double quantisation | True | Saves additional 0.37 bits/parameter. |
| Optimiser | Paged AdamW 8-bit | Optimiser states paged to CPU RAM — enables training on 40GB GPU. |

---

## 🔧 Training Configuration

Both LoRA and QLoRA use **SFTTrainer** from the TRL library.

| Hyperparameter | Value | Justification |
|----------------|:-----:|---------------|
| Epochs | 3 | Converges by epoch 2. Third epoch confirms stability. |
| Learning rate | 2e-4 | Standard LoRA LR. Higher than full FT because only adapters update. |
| Per-device batch | 4 | Maximum fitting within A100 memory alongside model and gradients. |
| Gradient accumulation | 4 steps | Effective batch size 16. Stable gradient estimates. |
| LR scheduler | Cosine | Smooth decay to near-zero. Avoids destabilisation late in training. |
| Total steps | 381 | 2,029 samples / batch 16 × 3 epochs. |
| Max seq length | 512 | Covers all DrugBank triple sets. |
| Hardware | NVIDIA A100 | 80GB for LoRA, 40GB for QLoRA. |
| Training time | ~20–25 min | Per run on A100. |

---

## 📏 Evaluation Metrics

| Metric | Category | Purpose |
|--------|----------|---------|
| **BLEU** | Text Similarity | N-gram precision — exact pharmaceutical terminology accuracy |
| **ROUGE-L** | Text Similarity | Sentence-level structural fluency |
| **BERTScore F1** | Semantic | Semantic correctness beyond surface word overlap |
| **Fact Precision** | Factual | Proportion of generated facts verifiable against input triples |
| **Fact Recall** | Factual | Proportion of input facts present in generated text |
| **Fact F1** | Factual | Combined factual quality score |
| **Hallucination Rate** | Hallucination | Proportion of outputs with facts not in input — primary Depixen metric |
| **Exact Match Rate** | Accuracy | Strictest quality measure — perfect generation frequency |

---

## 🛠️ Installation

```bash
git clone https://github.com/sai-uel/kg-to-text-slm-project
cd kg-to-text-slm-project
pip install -r requirements.txt
```

### requirements.txt

```
transformers==4.45.0
peft==0.13.0
trl==0.11.4
accelerate==0.34.2
bitsandbytes>=0.41.0
datasets>=2.14.0
evaluate>=0.4.0
bert-score>=0.3.13
rouge-score>=0.1.2
torch>=2.0.0
sentencepiece
huggingface-hub
gradio>=4.0.0
fastapi
uvicorn
pymongo
```

> ⚠️ **Version pinning is important.** These exact versions were tested and confirmed compatible with the Phi-3.5 and Gemma model families. Transformers 5.x introduced breaking changes in the KV cache API.

---

## ⚡ Quick Start

### Load the Merged Model (No PEFT Required)

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "BSVGK/gemma-1.1-2b-it-drugbank-kg2text-merged-v2"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)
```

### Load with LoRA Adapter (Requires PEFT)

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch

base_model_id = "google/gemma-1.1-2b-it"
adapter_id    = "BSVGK/gemma-1.1-2b-it-drugbank-kg2text-lora-v2"

tokenizer = AutoTokenizer.from_pretrained(base_model_id)
base_model = AutoModelForCausalLM.from_pretrained(
    base_model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)
model = PeftModel.from_pretrained(base_model, adapter_id)
```

---

## 🔍 Inference

```python
def generate_description(triples: str, model, tokenizer, max_new_tokens=300):
    """
    Generate a natural language description from RDF pharmaceutical triples.
    
    Args:
        triples: String of RDF triples, one per line
        model: Loaded Gemma model
        tokenizer: Loaded tokenizer
        max_new_tokens: Maximum tokens to generate
    
    Returns:
        Generated natural language drug description
    """
    prompt = f"""<start_of_turn>user
You are a pharmaceutical expert. Given the following RDF triples describing a drug, 
generate an accurate and informative natural language description.

RDF Triples:
{triples}

Generate a clear, accurate description of this drug based only on the information 
provided in the triples above.<end_of_turn>
<start_of_turn>model
"""
    
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=False,          # Greedy decoding for factual consistency
            temperature=1.0,
            pad_token_id=tokenizer.eos_token_id
        )
    
    # Decode only new tokens
    new_tokens = outputs[0][inputs["input_ids"].shape[1]:]
    return tokenizer.decode(new_tokens, skip_special_tokens=True)


# Example usage
triples = """
(DB00945, rdf:type, Drug)
(DB00945, hasName, Aspirin)
(DB00945, hasIndication, Treatment of mild to moderate pain and fever)
(DB00945, hasMechanismOfAction, Inhibition of cyclooxygenase enzymes COX-1 and COX-2)
(DB00945, hasGroup, approved)
(DB00945, hasAverageMass, 180.158)
"""

description = generate_description(triples, model, tokenizer)
print(description)
```

---

## 🎛️ Gradio Demo

The DrugKG Text AI Gradio interface provides an interactive way to test the model.

```python
import gradio as gr
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "BSVGK/gemma-1.1-2b-it-drugbank-kg2text-merged-v2"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, torch_dtype=torch.float16, device_map="auto"
)

def predict(triples_input):
    return generate_description(triples_input, model, tokenizer)

demo = gr.Interface(
    fn=predict,
    inputs=gr.Textbox(
        label="Input RDF Triples",
        placeholder="(DB00132, rdf:type, Drug)\n(DB00132, hasName, ...)",
        lines=8
    ),
    outputs=gr.Textbox(label="Generated Drug Description", lines=6),
    title="DrugKG Text AI",
    description="Generate natural language drug descriptions from DrugBank RDF triples using fine-tuned Gemma 1.1 2B IT + LoRA."
)

demo.launch()
```

---

## 🤗 HuggingFace Links

| Resource | Link |
|----------|------|
| 🤗 Merged Model (no PEFT needed) | [BSVGK/gemma-1.1-2b-it-drugbank-kg2text-merged-v2](https://huggingface.co/BSVGK/gemma-1.1-2b-it-drugbank-kg2text-merged-v2) |
| 📎 LoRA Adapter | [BSVGK/gemma-1.1-2b-it-drugbank-kg2text-lora-v2](https://huggingface.co/BSVGK/gemma-1.1-2b-it-drugbank-kg2text-lora-v2) |
| 📊 Training Dataset | [BSVGK/drugbank_dataset](https://huggingface.co/datasets/BSVGK/drugbank_dataset) |
| 👤 BSVGK Profile | [huggingface.co/BSVGK](https://huggingface.co/BSVGK) |

All models and datasets are **publicly accessible** — no access request required.

---

## 👥 Project Team

| Name | Role |
|------|------|
| **Sai Venkata Gopala Krishna Bubathula** | Model Lead — fine-tuning, evaluation, deployment |
| Keremfon Ekerete | Model Research & Comparison |
| Anthony Mensah | Knowledge Representation & Prompting |
| Poojitha Yemineni | Dataset & Instruction Tuning Lead |
| Emmanuel Enotobore | Demo & Integration Lead |

**Line Manager:** Ugur Acar, Chief AI Officer, Depixen  
**Supervisor:** Yalcin, Depixen  
**Placement Lead:** Dr Ali Abbas, University of East London  
**Placement Period:** 26 January – 20 May 2026

---

## 📖 Citation

If you use this work, model or dataset in your research, please cite:

```bibtex
@misc{bubathula2026kg2text,
  author       = {Bubathula, Sai Venkata Gopala Krishna and
                  Ekerete, Keremfon and
                  Mensah, Anthony and
                  Yemineni, Poojitha and
                  Enotobore, Emmanuel},
  title        = {KG-to-Text SLM: Fine-Tuning Gemma 1.1 2B IT on Verified
                  DrugBank Pharmaceutical Data for Hallucination-Free
                  Drug Description Generation},
  year         = {2026},
  institution  = {University of East London / Depixen},
  url          = {https://github.com/sai-uel/kg-to-text-slm-project},
  note         = {Industrial Placement Project, MSc Big Data Technologies}
}
```

---

## 📄 License

This project is licensed under the **Apache 2.0 License** — see [LICENSE](LICENSE) for details.

DrugBank data is used under a **university research licence**. See [DrugBank Terms](https://go.drugbank.com/legal/terms_of_service) for usage conditions.

---

<div align="center">
  <strong>University of East London × Depixen</strong><br>
  Industrial Placement 2026 · MSc Big Data Technologies<br>
  <a href="https://github.com/sai-uel/kg-to-text-slm-project">GitHub</a> ·
  <a href="https://huggingface.co/BSVGK">HuggingFace</a> ·
  <a href="https://www.linkedin.com/in/sai-venkata-gopala-krishna-bubathula-a05a26283/">LinkedIn</a>
</div>
