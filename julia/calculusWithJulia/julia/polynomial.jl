using Plots
using SymPy

# @ in julia is macro call, use ?@ in julia REPL
# create Symbol 
@syms a,b,c,d,x

# then use it in equation 
# you can call p() to subtitute symbol with new equation
p = 16*x^2 - 100
p(x => (x-1)^2)

print(p)
