import os
import re

directory = 'c:/Users/drefl/vrsa-guide/src/pages'
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remove target="_blank" rel="noopener noreferrer"
            new_content = content.replace(' target="_blank" rel="noopener noreferrer"', '')
            new_content = new_content.replace(' target=\'_blank\' rel=\'noopener noreferrer\'', '')
            new_content = new_content.replace(' target="_blank"', '')
            new_content = new_content.replace(',\'_blank\',\'noopener,noreferrer\'', '')
            new_content = new_content.replace(', \'_blank\', \'noopener,noreferrer\'', '')
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {file}')
print('Done!')
