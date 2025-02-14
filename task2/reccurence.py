def layup_sequence(n):
    if n == 1:
        return 1
    if n == 2:
        return 2
        
    # Use array instead of dict for faster access
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    # Bottom-up approach
    for i in range(3, n + 1):
        if i % 2 == 0:
            dp[i] = dp[i-1] + dp[i-2]
        else:
            dp[i] = 2 * dp[i-1] - dp[i-2]
    
    return dp[n]

import time

def measure_runtime(n):
    start = time.perf_counter()
    result = layup_sequence(n)
    end = time.perf_counter()
    return end - start, result

runtime, result = measure_runtime(10000)
print(f"Result for n=10000: {result}")
print(f"Runtime: {runtime:.6f} seconds")
