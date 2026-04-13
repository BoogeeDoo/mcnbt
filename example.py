#!/usr/bin/env python3

"""
示例Python文件
这个文件展示了基本的Python语法和功能
"""

def greet(name):
    """向用户问好"""
    return f"你好，{name}！欢迎使用Python。"


def calculate_sum(a, b):
    """计算两个数的和"""
    return a + b


if __name__ == "__main__":
    # 测试greet函数
    print(greet("世界"))
    
    # 测试calculate_sum函数
    result = calculate_sum(5, 3)
    print(f"5 + 3 = {result}")
    
    # 打印当前文件信息
    print("这是一个示例Python文件，位于/workspace/example.py")
