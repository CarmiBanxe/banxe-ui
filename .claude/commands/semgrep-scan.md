# /semgrep-scan — BANXE UI Code Quality Scan

Run a full quality scan on the BANXE UI codebase using Semgrep custom rules + ESLint.

## Steps

1. **Run BANXE Semgrep rules** (I-05, AI badge, a11y, hex colors):
```bash
cd ~/banxe-ui
semgrep --config .semgrep/banxe-ui-rules.yaml \
  apps/web/src/ packages/ui/src/ \
  --json --output /tmp/semgrep-banxe.json 2>&1 | tail -5
python3 -c "
import json
data = json.load(open('/tmp/semgrep-banxe.json'))
findings = data.get('results', [])
if not findings:
    print('✅ Semgrep: 0 violations')
else:
    print(f'⚠️  Semgrep: {len(findings)} findings')
    for f in findings[:10]:
        sev = f['extra']['severity']
        rule = f['check_id'].split('.')[-1]
        path = f['path'].replace('/home/mmber/banxe-ui/', '')
        line = f['start']['line']
        print(f'  [{sev}] {rule} — {path}:{line}')
"
```

2. **Run ESLint** (TypeScript + React + a11y):
```bash
cd ~/banxe-ui
npx eslint packages/ui/src apps/web/src --ext .ts,.tsx --max-warnings 0 2>&1 | tail -20
```

3. **Run TypeScript check**:
```bash
cd ~/banxe-ui && npx tsc --noEmit 2>&1 | head -30
```

4. **Run all unit tests**:
```bash
cd ~/banxe-ui && npx vitest run --reporter=verbose 2>&1 | tail -20
```

5. **Summary report** — after all checks, produce:
```
═══ BANXE UI Quality Gate ═══════════════════════
  Semgrep:    X findings (Y errors, Z warnings)
  ESLint:     PASS / X warnings
  TypeScript: PASS / X errors
  Tests:      X/Y passed
  Coverage:   X% lines
  ────────────────────────────────────────────────
  GATE: ✅ PASS / ❌ FAIL (errors block commit)
═════════════════════════════════════════════════
```

6. For each ERROR finding: propose a fix. Apply fixes only after user confirms.
   For WARNING findings: list them, ask if user wants to fix now or later.

## Rules reference

| Rule ID | Severity | What it catches |
|---------|----------|-----------------|
| `banxe-no-parsefloat-amounts` | ERROR | I-05: parseFloat() on amounts |
| `banxe-no-hardcoded-hex-color` | ERROR | style={{ color: '#...' }} |
| `banxe-button-missing-aria-label` | ERROR | Icon button without aria-label |
| `banxe-no-number-cast-amounts` | WARNING | Number() on possible amounts |
| `banxe-ai-response-missing-badge` | WARNING | AIInsightCard without badge prop |
| `banxe-no-spinner-only-loading` | WARNING | Spinner instead of Skeleton |
| `banxe-amount-missing-font-mono` | WARNING | AmountInput without monospace |
| `banxe-compliance-flag-required` | WARNING | BLOCKED tx without ComplianceFlag |
