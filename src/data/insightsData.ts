import { ArticleItem } from '../types';

export const insightsData: ArticleItem[] = [
  {
    slug: 'modern-rag-architecture',
    title: 'Architecting Enterprise RAG Systems: Beyond Basic Vector Similarity',
    category: 'AI & Data',
    publishedDate: 'October 12, 2026',
    readTime: '7 min read',
    excerpt: 'Naive vector search frequently fails on domain-specific enterprise queries. Here is how hybrid lexical ranking, contextual chunking, and strict citation reranking produce reliable, production-ready AI assistants.',
    author: {
      name: 'IAMTECHNI Engineering Team',
      role: 'Artificial Intelligence Practice'
    },
    tableOfContents: [
      { id: 'the-limits-of-naive-rag', title: '1. The Limits of Naive Vector Search' },
      { id: 'hybrid-retrieval-patterns', title: '2. Implementing Hybrid BM25 + Vector Retrieval' },
      { id: 'contextual-chunking', title: '3. Contextual Chunking and Sliding Windows' },
      { id: 'guardrails-and-citations', title: '4. Grounding Guardrails and Traceable Citations' }
    ],
    sections: [
      {
        id: 'the-limits-of-naive-rag',
        heading: '1. The Limits of Naive Vector Search',
        body: [
          'When organizations first pilot Retrieval-Augmented Generation (RAG), the typical tutorial architecture appears simple: split documents into 500-token chunks, compute vector embeddings, store them in a vector database, and retrieve the top-3 closest vectors via cosine similarity.',
          'In enterprise production, this naive pattern fails frequently. When an employee asks for "SOP-ENG-402 revision 3 section B", cosine similarity between dense embeddings often misses the exact document identifier because the mathematical semantic distance between different part numbers is negligible. Similarly, tables, bulleted lists, and acronyms get chopped mid-sentence, stripping away the context necessary for the language model to answer truthfully.'
        ]
      },
      {
        id: 'hybrid-retrieval-patterns',
        heading: '2. Implementing Hybrid BM25 + Vector Retrieval',
        body: [
          'To overcome semantic blindness on specific terms, robust enterprise RAG systems combine lexical (keyword) search with semantic vector search. By utilizing Reciprocal Rank Fusion (RRF) or cross-encoder rerankers, the retrieval engine scores documents based on both lexical precision (BM25) and conceptual similarity.'
        ],
        codeSnippet: {
          language: 'python',
          code: `# Hybrid retrieval ranking with Reciprocal Rank Fusion (RRF)
def reciprocal_rank_fusion(bm25_ranks, vector_ranks, k=60):
    rrf_scores = {}
    for rank, doc_id in enumerate(bm25_ranks):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)
    for rank, doc_id in enumerate(vector_ranks):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)
    
    # Sort documents by fused RRF score
    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)`
        }
      },
      {
        id: 'contextual-chunking',
        heading: '3. Contextual Chunking and Sliding Windows',
        body: [
          'Arbitrary character count chunking destroys semantic cohesion. A superior approach is document-aware chunking: parsing documents by heading hierarchy, appending parent section breadcrumbs to each sub-chunk, and maintaining a 15–20% token overlap.',
          'When each chunk retains its full structural context (e.g. "Operations Manual > Safety Protocols > High-Voltage Isolation"), the embedding vectors capture both specific actionable guidance and its governing scope.'
        ]
      },
      {
        id: 'guardrails-and-citations',
        heading: '4. Grounding Guardrails and Traceable Citations',
        body: [
          'Enterprise trust requires accountability. Our engineering standard mandates that RAG systems include strict system instructions preventing the model from synthesizing answers without citing the exact retrieved chunk ID and source page.',
          'If the retrieved context lacks sufficient evidence, the model is instructed to output an explicit acknowledgment of missing information and offer a recommended department contact, rather than hallucinating plausible-sounding procedures.'
        ]
      }
    ],
    relatedArticles: ['cloud-cost-optimization', 'web-performance-core-vitals']
  },
  {
    slug: 'cloud-cost-optimization',
    title: 'Practical FinOps: Engineering Disciplines That Reduce Cloud Waste by 30%',
    category: 'Cloud & DevOps',
    publishedDate: 'October 04, 2026',
    readTime: '6 min read',
    excerpt: 'Cloud bills often grow silently through over-provisioned instances, orphaned volumes, and unindexed database queries. A systematic review of engineering practices that keep infrastructure lean.',
    author: {
      name: 'IAMTECHNI Engineering Team',
      role: 'Cloud & Infrastructure Practice'
    },
    tableOfContents: [
      { id: 'the-anatomy-of-cloud-waste', title: '1. The Anatomy of Cloud Waste' },
      { id: 'compute-rightsizing', title: '2. Compute Right-Sizing and Auto-Scaling Caps' },
      { id: 'storage-lifecycle-rules', title: '3. Storage Tiering and Orphan Volume Cleanup' },
      { id: 'observability-as-defense', title: '4. Observability and Anomaly Alerting' }
    ],
    sections: [
      {
        id: 'the-anatomy-of-cloud-waste',
        heading: '1. The Anatomy of Cloud Waste',
        body: [
          'In the rush to deliver features, development teams frequently over-provision cloud resources under the assumption that larger instances prevent bottlenecks. Over months, development and staging instances remain active 24/7, unattached block storage volumes accumulate, and logs sit in expensive multi-region buckets without expiration policies.',
          'True cloud efficiency is not about starving applications of resources; it is about establishing architectural discipline where resource provisioning dynamically mirrors actual business demand.'
        ]
      },
      {
        id: 'compute-rightsizing',
        heading: '2. Compute Right-Sizing and Auto-Scaling Caps',
        body: [
          'By auditing CPU and memory utilization percentiles (specifically P95 and P99 over 14-day rolling windows), organizations routinely discover that instances operate below 8% average CPU utilization. Migrating from older generation virtual machines to modern Graviton/ARM-based instances or right-sizing container CPU limits typically delivers immediate 20–35% cost reductions with zero performance degradation.'
        ],
        codeSnippet: {
          language: 'bash',
          code: `# Identify unattached EBS volumes in AWS CLI for safe auditing
aws ec2 describe-volumes \\
  --filters Name=status,Values=available \\
  --query "Volumes[*].{ID:VolumeId,Size:Size,Created:CreateTime}" \\
  --output table`
        }
      },
      {
        id: 'storage-lifecycle-rules',
        heading: '3. Storage Tiering and Orphan Volume Cleanup',
        body: [
          'Application logs, staging backups, and user uploads should never sit indefinitely on primary SSD or hot S3 storage. Enforcing automated lifecycle rules that transition objects to infrequent-access tiers after 30 days and Glacier archive after 90 days reduces long-term storage costs by up to 70%.'
        ]
      },
      {
        id: 'observability-as-defense',
        heading: '4. Observability and Anomaly Alerting',
        body: [
          'The most dangerous cloud costs are unexpected anomalies—such as an unthrottled loop calling an external API or an unindexed query triggering infinite database read units. Setting automated daily budget threshold notifications ensures billing surprises are addressed within hours rather than at invoice time.'
        ]
      }
    ],
    relatedArticles: ['modern-rag-architecture', 'web-performance-core-vitals']
  },
  {
    slug: 'web-performance-core-vitals',
    title: 'Engineering for Sub-Second Web Performance and Perfect Core Web Vitals',
    category: 'Web Engineering',
    publishedDate: 'September 24, 2026',
    readTime: '5 min read',
    excerpt: 'Why modern corporate websites suffer from layout shifts and sluggish interaction response, and how clean component architecture and asset optimization achieve 95+ Lighthouse scores.',
    author: {
      name: 'IAMTECHNI Engineering Team',
      role: 'Frontend Engineering Practice'
    },
    tableOfContents: [
      { id: 'why-performance-is-commercial', title: '1. Why Performance is a Commercial Requirement' },
      { id: 'mastering-lcp-and-inp', title: '2. Mastering LCP and INP in Modern React' },
      { id: 'eliminating-layout-shifts', title: '3. Eliminating Cumulative Layout Shifts (CLS)' },
      { id: 'continuous-budgets', title: '4. Enforcing Continuous Performance Budgets' }
    ],
    sections: [
      {
        id: 'why-performance-is-commercial',
        heading: '1. Why Performance is a Commercial Requirement',
        body: [
          'Website speed is directly correlated with customer trust and search engine rank. According to Google telemetry, every additional second of mobile load latency increases bounce rates significantly. When enterprise decision-makers evaluate prospective partners, a sluggish corporate website creates an immediate impression of technical negligence.',
          'High performance is not achieved by installing an optimization plugin at the end of a project; it must be designed into the foundational component architecture from the first line of code.'
        ]
      },
      {
        id: 'mastering-lcp-and-inp',
        heading: '2. Mastering LCP and INP in Modern React',
        body: [
          'Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) are the defining metrics of modern web responsiveness. Optimizing LCP requires preloading critical hero fonts, serving modern AVIF/WebP image formats with explicit aspect ratio bounding boxes, and deferring non-essential third-party tracking scripts until after page hydration.'
        ],
        codeSnippet: {
          language: 'html',
          code: `<!-- Proper critical asset preloading without blocking the parser -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="image" href="/hero-display.webp" fetchpriority="high" />`
        }
      },
      {
        id: 'eliminating-layout-shifts',
        heading: '3. Eliminating Cumulative Layout Shifts (CLS)',
        body: [
          'Cumulative Layout Shift (CLS) occurs when elements jump position as images, fonts, or asynchronous banners load. To maintain a CLS of 0.0, every image and media container must have reserved CSS aspect ratios (`aspect-[16/9]`), web fonts must specify matching fallback metrics via `font-display: swap`, and dynamic content inserts must allocate placeholder heights.'
        ]
      },
      {
        id: 'continuous-budgets',
        heading: '4. Enforcing Continuous Performance Budgets',
        body: [
          'Performance regressions occur gradually: an oversized client package added here, an uncompressed image committed there. We configure automated CI/CD performance checks using Lighthouse CI that fail pull requests if initial JavaScript payload exceeds 180KB or if performance scores drop below 90.'
        ]
      }
    ],
    relatedArticles: ['modern-rag-architecture', 'cloud-cost-optimization']
  }
];
