from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def helper(self, startI, endI, startP, endP, inorder, postorder, indexMap):
        if startI > endI or startP > endP:
            return None

        root = TreeNode(postorder[endP])
        print("Val = ", postorder[endP])
        j = indexMap[postorder[endP]]
        print("J = ", j)
        size = j - startI
        print("Size = ", size)
        root.left = self.helper(startI, j - 1, startP, startP + size - 1, inorder, postorder, indexMap)
        root.right = self.helper(j + 1, endI, startP + size, endP - 1, inorder, postorder, indexMap)
        
        return root

    def buildTree(self, postorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        indexMap = {val: idx for idx, val in enumerate(inorder)}
        length = len(inorder) - 1
        print(indexMap)
        print(inorder)
        return self.helper(0, length, 0, length, inorder, postorder, indexMap)

# Example usage
inorder = [9, 3, 15, 20, 7]
postorder = [9, 15, 7, 20, 3]
solution = Solution()
root = solution.buildTree(postorder, inorder)