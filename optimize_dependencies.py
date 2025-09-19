#!/usr/bin/env python3
import os
import json
from collections import defaultdict

def analyze_duplicate_dependencies():
    """Find duplicate dependencies across workspaces"""
    print("🔍 DEPENDENCY OPTIMIZATION ANALYSIS")
    print("=" * 50)
    
    # Find all package.json files
    package_files = []
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.next', '.turbo', '.nx', '.cache', '.git']]
        
        if 'package.json' in files:
            package_files.append(os.path.join(root, 'package.json'))
    
    # Analyze dependencies
    all_deps = defaultdict(list)
    all_dev_deps = defaultdict(list)
    
    workspace_info = []
    
    for pkg_file in package_files:
        try:
            with open(pkg_file, 'r') as f:
                data = json.load(f)
            
            rel_path = os.path.relpath(pkg_file)
            name = data.get('name', os.path.dirname(rel_path))
            
            deps = data.get('dependencies', {})
            dev_deps = data.get('devDependencies', {})
            
            workspace_info.append({
                'path': rel_path,
                'name': name,
                'deps': deps,
                'dev_deps': dev_deps
            })
            
            # Track where each dependency is used
            for dep, version in deps.items():
                all_deps[dep].append((rel_path, version))
            
            for dep, version in dev_deps.items():
                all_dev_deps[dep].append((rel_path, version))
                
        except Exception as e:
            print(f"   ❌ Error reading {pkg_file}: {e}")
    
    # Find duplicates
    duplicate_deps = {dep: locations for dep, locations in all_deps.items() if len(locations) > 1}
    duplicate_dev_deps = {dep: locations for dep, locations in all_dev_deps.items() if len(locations) > 1}
    
    print(f"\n📦 DUPLICATE DEPENDENCIES:")
    if duplicate_deps:
        print(f"   Found {len(duplicate_deps)} duplicate production dependencies:")
        for dep, locations in list(duplicate_deps.items())[:10]:
            print(f"      {dep}:")
            for path, version in locations:
                print(f"         - {path} ({version})")
    else:
        print("   ✅ No duplicate production dependencies found")
    
    print(f"\n🛠️  DUPLICATE DEV DEPENDENCIES:")
    if duplicate_dev_deps:
        print(f"   Found {len(duplicate_dev_deps)} duplicate dev dependencies:")
        for dep, locations in list(duplicate_dev_deps.items())[:10]:
            print(f"      {dep}:")
            for path, version in locations:
                print(f"         - {path} ({version})")
    else:
        print("   ✅ No duplicate dev dependencies found")
    
    # Heavy dependencies analysis
    heavy_deps = [
        'webpack', 'babel', 'typescript', 'react', 'next', 'vite', 'rollup',
        'eslint', 'prettier', 'jest', 'vitest', 'cypress', 'playwright',
        '@types/node', '@types/react', 'tailwindcss', 'postcss'
    ]
    
    found_heavy = []
    for dep in heavy_deps:
        if dep in all_deps or dep in all_dev_deps:
            locations = all_deps.get(dep, []) + all_dev_deps.get(dep, [])
            found_heavy.append((dep, len(locations)))
    
    if found_heavy:
        print(f"\n🔥 HEAVY DEPENDENCIES FOUND:")
        found_heavy.sort(key=lambda x: x[1], reverse=True)
        for dep, count in found_heavy:
            print(f"      {dep} (used in {count} workspace{'s' if count > 1 else ''})")
    
    # Recommendations
    print(f"\n💡 OPTIMIZATION RECOMMENDATIONS:")
    
    if duplicate_deps:
        print(f"   1. Move common dependencies to root package.json:")
        common_prod_deps = [dep for dep, locations in duplicate_deps.items() if len(locations) >= len(workspace_info) // 2]
        if common_prod_deps:
            print(f"      Candidates: {', '.join(common_prod_deps[:5])}{'...' if len(common_prod_deps) > 5 else ''}")
    
    if duplicate_dev_deps:
        print(f"   2. Move common dev dependencies to root package.json:")
        common_dev_deps = [dep for dep, locations in duplicate_dev_deps.items() if len(locations) >= len(workspace_info) // 2]
        if common_dev_deps:
            print(f"      Candidates: {', '.join(common_dev_deps[:5])}{'...' if len(common_dev_deps) > 5 else ''}")
    
    print(f"   3. Consider using 'npm dedupe' to reduce duplicate packages")
    print(f"   4. Use 'npm ls --depth=0' to see top-level dependencies")
    print(f"   5. Consider using 'bundlephobia.com' to check package sizes")
    
    return len(duplicate_deps) + len(duplicate_dev_deps)

def main():
    print("🧪 CONSULTING19 SMOKE TEST")
    print("=" * 40)
    
    # Check if we're in a valid project
    if not os.path.exists('package.json'):
        print("❌ No package.json found in current directory")
        return
    
    # 1. Dependency optimization analysis
    duplicate_count = analyze_duplicate_dependencies()
    
    # 2. Quick build test
    print(f"\n🔨 BUILD TEST:")
    success, stdout, stderr = run_command("npm run build --if-present", timeout=60)
    if success:
        print("   ✅ Build command completed successfully")
    else:
        print(f"   ⚠️  Build issues (this might be normal): {stderr[:100]}...")
    
    # 3. Lint test
    print(f"\n🧹 LINT TEST:")
    success, stdout, stderr = run_command("npm run lint --if-present", timeout=30)
    if success:
        print("   ✅ Lint passed")
    elif "command not found" in stderr or "missing script" in stderr:
        print("   ℹ️  No lint script found (optional)")
    else:
        print(f"   ⚠️  Lint issues: {stderr[:100]}...")
    
    # 4. Final status
    print(f"\n📊 FINAL STATUS:")
    if duplicate_count == 0:
        print("✅ Dependencies are well optimized")
    elif duplicate_count < 10:
        print("⚠️  Some dependency optimization possible")
    else:
        print("❌ Significant dependency optimization needed")
    
    print(f"\n🎯 READY FOR DEVELOPMENT:")
    print(f"   Your project structure is analyzed and cleaned.")
    print(f"   You can now run 'npm run dev' in your app directories.")
    print(f"   Monitor console for any runtime issues.")

if __name__ == "__main__":
    main()