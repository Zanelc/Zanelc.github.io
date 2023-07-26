## 一键部署
import os
static_cmd="hexo clean && hexo g && hexo d"
source_cmd='git add . && git commit -m "source update" && git push origin source'
try:
    print("---------网页文件PUSH---------")
    os.system(static_cmd)
    print("网页push成功！")
    os.system(source_cmd)
    print("\n\n")
    print("---------代码文件PUSH---------")
    print("源代码push成功！")
except:
    print("部署失败，请手动检查情况！")