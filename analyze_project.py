#!/usr/bin/env python3
import os
import json

def get_size(path):
    """Get size of file or directory in bytes"""
    if os.path.isfile(path):
        return os.path.getsize(path)
    elif os.path.isdir(path):
        total = 0
        try:
            for dirpath, dirnames, filenames in os.walk(path):
                for filename in filenames:
                    filepath = os.path.join(dirpath, filename)
                    try:
                        total += os.path.getsize(filepath)
                    except (OSError, IOError):
                        pass
        except (OSError, IOError):
            pass
        return total
    return 0

def format_size(bytes_size):
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.1f} TB"

def analyze_package_json(file_path):
    """Analyze package.json for dependencies"""
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        deps = data.get('dependencies', {})
        dev_deps = data.get('devDependencies', {})
        
        return {
            'name': data.get('name', 'Unknown'),
            'dependencies': len(deps),
            'devDependencies': len(dev_deps),
            'total_deps': len(deps) + len(dev_deps),
            'deps_list': list(deps.keys()),
            'dev_deps_list': list(dev_deps.keys())
        }
    except:
        return None

def main():
    print("🔍 CONSULTING19 PROJECT ANALYSIS")
    print("=" * 50)
    
    # Find all package.json files
    package_files = []
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and other build directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.next', '.turbo', '.nx', '.cache']]
        
        if 'package.json' in files:
            package_files.append(os.path.join(root, 'package.json'))
    
    print(f"📦 Found {len(package_files)} package.json files:")
    
    total_deps = 0
    all_deps = set()
    
    for pkg_file in package_files:
        analysis = analyze_package_json(pkg_file)
        if analysis:
            rel_path = os.path.relpath(pkg_file)
            print(f"\n📁 {rel_path}")
            print(f"   Name: {analysis['name']}")
            print(f"   Dependencies: {analysis['dependencies']}")
            print(f"   Dev Dependencies: {analysis['devDependencies']}")
            print(f"   Total: {analysis['total_deps']}")
            
            total_deps += analysis['total_deps']
            all_deps.update(analysis['deps_list'])
            all_deps.update(analysis['dev_deps_list'])
            
            # Show heavy dependencies
            heavy_deps = [dep for dep in analysis['deps_list'] if any(keyword in dep.lower() for keyword in ['webpack', 'babel', 'typescript', 'react', 'next', 'vite', 'rollup'])]
            if heavy_deps:
                print(f"   🔥 Heavy deps: {', '.join(heavy_deps[:3])}{'...' if len(heavy_deps) > 3 else ''}")
    
    print(f"\n📊 DEPENDENCY SUMMARY")
    print(f"   Total unique dependencies: {len(all_deps)}")
    print(f"   Total dependency entries: {total_deps}")
    
    # Analyze source code size
    print(f"\n📁 SOURCE CODE ANALYSIS")
    
    source_extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte', '.css', '.scss', '.sass', '.less']
    large_files = []
    total_source_size = 0
    file_count = 0
    
    for root, dirs, files in os.walk('.'):
        # Skip build directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.next', '.turbo', '.nx', '.cache', '.git']]
        
        for file in files:
            if any(file.endswith(ext) for ext in source_extensions):
                file_path = os.path.join(root, file)
                size = get_size(file_path)
                total_source_size += size
                file_count += 1
                
                if size > 100 * 1024:  # Files larger than 100KB
                    large_files.append((file_path, size))
    
    print(f"   Total source files: {file_count}")
    print(f"   Total source size: {format_size(total_source_size)}")
    
    if large_files:
        print(f"\n🔥 LARGE SOURCE FILES (>100KB):")
        large_files.sort(key=lambda x: x[1], reverse=True)
        for file_path, size in large_files[:10]:
            rel_path = os.path.relpath(file_path)
            print(f"   {format_size(size)} - {rel_path}")
    
    # Check for potential issues
    print(f"\n⚠️  POTENTIAL ISSUES:")
    
    # Check for duplicate dependencies across workspaces
    workspace_deps = {}
    for pkg_file in package_files:
        analysis = analyze_package_json(pkg_file)
        if analysis:
            workspace_deps[pkg_file] = set(analysis['deps_list'] + analysis['dev_deps_list'])
    
    if len(workspace_deps) > 1:
        common_deps = set.intersection(*workspace_deps.values()) if workspace_deps else set()
        if common_deps:
            print(f"   📦 {len(common_deps)} dependencies appear in multiple workspaces")
            print(f"      Consider moving to root: {', '.join(list(common_deps)[:5])}{'...' if len(common_deps) > 5 else ''}")
    
    # Check for very large source files
    very_large_files = [f for f, s in large_files if s > 500 * 1024]  # >500KB
    if very_large_files:
        print(f"   📄 {len(very_large_files)} source files are very large (>500KB)")
        print(f"      Consider splitting these files")
    
    print(f"\n💡 RECOMMENDATIONS:")
    print(f"   1. Use 'npm ci' instead of 'npm install' for faster, consistent installs")
    print(f"   2. Consider using .npmrc with 'prefer-offline=true' to speed up installs")
    print(f"   3. Regularly audit dependencies with 'npm audit'")
    if len(all_deps) > 50:
        print(f"   4. Consider dependency consolidation - you have {len(all_deps)} unique deps")
    
    print(f"\n✅ ANALYSIS COMPLETE")

if __name__ == "__main__":
    main()