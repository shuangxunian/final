import os
os.system('pip freeze > packages.txt')
os.system('pip uninstall -y -r packages.txt')