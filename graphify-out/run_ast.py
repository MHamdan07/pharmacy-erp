import json
from pathlib import Path
from graphify.extract import collect_files, extract


detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8-sig'))
files = detect.get('files', {}).get('code', [])
code_files = []
for f in files:
    path = Path(f)
    if path.is_dir():
        code_files.extend(collect_files(path))
    else:
        code_files.append(path)

if code_files:
    result = extract(code_files, cache_root=Path('.'))
else:
    result = {'nodes': [], 'edges': [], 'input_tokens': 0, 'output_tokens': 0}

Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"AST: {len(result['nodes'])} nodes, {len(result['edges'])} edges")
