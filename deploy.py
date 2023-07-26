## 一键部署
import os
static_cmd="hexo c && hexo g && hexo d"
source_cmd='git add . && git commit -m "source update" && git push origin source'
try:
    os.system(static_cmd)
    print("网页push成功！")
    os.system(source_cmd)
    print("源代码push成功！")
except:
    print("部署失败，请手动检查情况！")