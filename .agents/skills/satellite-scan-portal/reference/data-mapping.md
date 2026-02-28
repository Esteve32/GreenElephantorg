# Satellite Scan — Google Sheets Data Mapping

This document maps the data labels from the Google Slides template to expected Google Sheets columns in the master spreadsheet (`11dKNeCJcKizW63dmFxggO1-D5K3wGLKZ8sMKRTZAKVo`).

## Important Notes
- The actual column positions need to be verified against the live spreadsheet when development begins
- Data labels in angle brackets (e.g., `<EGO_TRIGGERS>`) are placeholders in the slides template that get populated per client
- Some fields contain single numeric values (1-10 scales), others contain lists or text blocks
- AI-generated text fields (superpowers, advice) may be in separate columns or a separate sheet/tab

## Data Fields by Section

### Client Identity
| Field | Type | Description |
|-------|------|-------------|
| FNAME | text | Client first name |
| LNAME | text | Client last name |
| DATE | date | Scan completion date (DD.MM.YYYY) |

### Ego Section
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `EGO_TRIGGERS` | text/list | multiple selections | Topics that trigger the client |
| `EGO_COMPARISON` | number | 1-10 | How often they compare people |
| `EGO_ROLES` | number[] | 1-10 each | Scores for 10 ego roles |
| `EDUCATION` | text | categorical | Education level |
| `TIME_IN_ORG` | text | categorical | Time in current organization |
| `YOB` | number | year | Year of birth (for generation) |

### Ego Roles (Element IDs)
| Role | Element ID | Type |
|------|-----------|------|
| Interpreter | 7110 | number 1-10 |
| Interrogator | 7111 | number 1-10 |
| Judge | 7112 | number 1-10 |
| Devil's Advocate | 7113 | number 1-10 |
| Hero | 7114 | number 1-10 |
| Narrator | 7115 | number 1-10 |
| Hermit | 7116 | number 1-10 |
| Artisan | 7117 | number 1-10 |
| Host | 3114 | number 1-10 |
| Harvester | 3111 | number 1-10 |

### 5 Barriers (Element IDs)
| Barrier | Element ID | Data Label |
|---------|-----------|-----------|
| Consciousness | 7104 | `SELF_AWARENESS` |
| Permission | 7105 | `CHECKING_ASSUMPTIONS` |
| Sensorial | 7106 | `EXTERNAL_AUTHORITY` |
| Language | 7107 | `ELEPHANT` |
| Tangibility | 7108 | `ADAPTING`, `LABELLING` |

### Dynamics Section
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `RELATIONSHIP_BUILDING` | number | 1-10 | Relationship management competence |
| `LEAD_COMPETENCE` | number | 1-10 | Lead competence |
| `FOLLOW_COMPETENCE` | number | 1-10 | Follow competence |
| `CONVERSATION_POLARITY` | number[] | mixed | Vertical/horizontal/dynamic communication |

### Influence Section
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `%GBRFOCUS_CHALLENGING_SITUATION` | text/number | GBR split | Dominant focus in challenging situations |
| `EFFICACY_COMMUNICATION` | number | 1-10 | Perceived influence efficacy |
| `EXPRESSING_COMPETENCE` | number | 1-10 | Blue/expressing competence |
| `HOSTING_COMPETENCE` | number | 1-10 | Red/hosting competence |
| `PRESENCING_COMPETENCE` | number | 1-10 | Green/presencing competence |
| `GBR_NV_AGGREGATED` | number[] | 1-10 × 5 × 3 | Non-verbal by GBR color (timing, rhythm, body-language, silence, intonation) |

### Intentions & Verbal (by color)
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `BLUE_INTENTIONS` | number | 1-10 | Blue intention focus |
| `BLUE_VERBAL_COMPETENCE` | number | 1-10 | Blue verbal competence |
| `RED_INTENTIONS` | number | 1-10 | Red intention focus |
| `RED_VERBAL_COMPETENCE` | number | 1-10 | Red verbal competence |
| `GREEN_VERBAL_COMPETENCE` | number | 1-10 | Green verbal competence |

### Attitude Section
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `GROWTH_FOCUS` | number | 1-10 | Growth mindset indication |
| `ATTITUDE_SCORE` | number/text | categorical | 4 attitudes to change |
| `ACTIVATION_LEARNING_NEEDS` | text | categorical | Type of learning help needed |
| `LEARNING_HOURS` | number | hours/week | Average learning hours per week |
| `PRACTICAL_EXPERIENCE_GE` | text/number | mixed | GE training sessions attended |
| `THEORY_WATCHED_GE` | text/number | mixed | GE video content watched |

### Chaordic Section
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `CHAORDIC_SCORE` | number | 1-10 | Creative freedom level |
| `WASTED_TIME` | number/text | mixed | Perceived wasted time from chaos |
| `ORDER` | number[] | 1-10 per item | Order/structure per activity |
| `COLLECTIVE_INTELLIGENCE` | number[] | mixed | Roles for collective intelligence |
| `QUALITY_COMMUNICATION` | number[] | 1-10 × 4 | 4 conversation levels competence |

### Flow Section
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `MOTIVATION` | number | 1-10 | Motivation to reach flow |
| `COMPETENCE` | number | 1-10 | Perceived competence |
| `CHALLENGE` | number | 1-10 | Perceived challenge |
| `FLOW_FEELING` | text/list | 8 feelings | Most common communication feelings |
| `GIVE_FEEDBACK` | number[] | mixed | Feedback given (praise, opinions, advice) |
| `RECEIVE_FEEDBACK` | number[] | mixed | Feedback received |
| `FEEDBACK_QTY` | number | 1-10 | Enough feedback received |

### Alignment Section
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `GBR_AVERAGE_V_NV_I` | number[] | 1-10 × 3 × 3 | GBR congruence grid |

### Needs Section
| Data Label | Type | Range | Description |
|-----------|------|-------|-------------|
| `CONFLICT_BEHAVIOUR` | number/text | spectrum | Dysfunctional to functional conflicts |
| `SELF_AWARENESS_COMPETENCE` | number | 1-10 | Self-awareness of communication |
| `CHECKING_ASSUMPTIONS_COMPETENCE` | number | 1-10 | Competence checking assumptions |
| `AGGREGATED_NEEDS` | number[] | 1-10 × 7 | 7 needs categories (strategy, goals, expression, respect, autonomy, resources, safety) |
| `GROUP_NEEDS` | text/number[] | 5 stages | Team formation stage needs |

### Situations
| Data Label | Type | Description |
|-----------|------|-------------|
| `ALL_SITUATIONS` | text/list | All communication situations |
| `COMMON_SITUATIONS` | text/list | 3-5 most common situations |
| `CHALLENGING_SITUATIONS` | text/list | Most challenging situations |

### AI-Generated Content
| Field | Type | Description |
|-------|------|-------------|
| Superpowers (5 items) | text blocks | AI-generated strength descriptions |
| Verbal Advice (3 items) | text blocks | Verbal communication coaching |
| Non-Verbal Advice (3 items) | text blocks | Non-verbal coaching |
| Values Advice (3 items) | text blocks | Values/intentions coaching |
| Micro-Habits (5 custom) | structured text | Trigger/Action/Reward per habit |

## Spreadsheet Tab Structure
The master spreadsheet likely has multiple tabs/sheets. Key tabs to investigate:
- Main data tab (raw survey responses)
- Calculated scores tab (aggregated metrics)
- AI-generated content tab (superpowers, advice text)
- Possibly separate tabs per lens

**Action item for Phase 2**: Read the actual spreadsheet headers to create the definitive column mapping before building the data pipeline.
