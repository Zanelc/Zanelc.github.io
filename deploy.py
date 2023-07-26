## 一键部署
import os
static_cmd="hexo clean && hexo g && hexo d"
source_cmd='git add . && git commit -m "source update" && git push origin source'
try:
    print("---------网页文件PUSH---------")
    os.system(static_cmd)
    print("---------网页PUSH成功---------")
    print("\n\n")
    print("---------代码文件PUSH---------")
    os.system(source_cmd)
    print("---------源代码PUSH成功---------")
except:
    print("部署失败，请手动检查情况！")