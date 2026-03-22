
def check_balance(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    stack = []
    for i, char in enumerate(content):
        if char == '(':
            stack.append(i)
        elif char == ')':
            if not stack:
                print(f"Unmatched ) at position {i}")
            else:
                stack.pop()
    
    for pos in stack:
        print(f"Unmatched ( at position {pos}")
        # Print context
        start = max(0, pos - 20)
        end = min(len(content), pos + 20)
        print(f"Context: {content[start:end]}")

check_balance('src/App.tsx')
