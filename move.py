import os
import shutil

root = r"c:\Users\visha\simbolonew"

def create_dir(path):
    os.makedirs(os.path.join(root, path), exist_ok=True)

def safe_move(src, dst):
    src_path = os.path.join(root, src)
    dst_path = os.path.join(root, dst)
    if os.path.exists(src_path):
        print(f"Moving {src} to {dst}")
        shutil.move(src_path, dst_path)

def safe_copy(src, dst):
    src_path = os.path.join(root, src)
    dst_path = os.path.join(root, dst)
    if os.path.exists(src_path):
        print(f"Copying {src} to {dst}")
        shutil.copy2(src_path, dst_path)

create_dir("apps/landing")
create_dir("packages/ui")
create_dir("packages/config")

safe_move("simbolo-admin", "apps/admin")
safe_move("simbolo-client", "apps/client")
safe_move("src", "apps/landing/src")
safe_move("public", "apps/landing/public")
safe_move("next.config.ts", "apps/landing/next.config.ts")
safe_move("next-env.d.ts", "apps/landing/next-env.d.ts")
safe_move("tsconfig.json", "apps/landing/tsconfig.json")
safe_move("postcss.config.mjs", "apps/landing/postcss.config.mjs")
safe_move("eslint.config.mjs", "apps/landing/eslint.config.mjs")
safe_copy("package.json", "apps/landing/package.json")

try:
    os.remove(os.path.join(root, "package-lock.json"))
except FileNotFoundError:
    pass
