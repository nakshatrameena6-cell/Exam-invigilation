import urllib.request
import zipfile
import os
import shutil

url = 'https://github.com/npm/cli-lts/archive/refs/heads/latest.zip'
zip_path = 'npm-cli-lts.zip'
extract_dir = 'npm-cli-lts'

print('Downloading npm CLI...')
urllib.request.urlretrieve(url, zip_path)
print('Downloaded.')

print('Extracting...')
with zipfile.ZipFile(zip_path, 'r') as z:
    z.extractall(extract_dir)
print('Extracted.')

src = os.path.join(extract_dir, os.listdir(extract_dir)[0])
dst = 'C:/npm-portable2'
if os.path.exists(dst):
    shutil.rmtree(dst)
shutil.copytree(src, dst)
print('Copied to', dst)
