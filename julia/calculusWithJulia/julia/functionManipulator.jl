using Plots


# vertical Shift 
#
# h(x) = k + f(x)
# L for lambda 

function up(f::Function, amount)
  x -> f(x) + amount
end
upL(f, k) = (x) -> f(x) + k


# horizontal Shift 
#
# h(x) = f(x-k)

function shift(f::Function, amount)
  x -> f(x - amount)
end
shiftL(f, amount) = x -> f(x - amount)

# Stretching 
#
# h(x) kf(x)
# other shape of lambda as function 
function stretch(f::Function, amount)
  return function (x)
    f(x) * amount
  end
end
stretchL(f, k) = x -> f(x) * k

# Scaling 
#
# h(x) = f(kx)

function timeScaling(f::Function, amount)
  x -> f(x * amount)
end

timeScalingL(f, k) = x -> f(x * k)

chopped = x -> sin(x)

plot(chopped, 0, pi, label="Original")
plt = plot!(up(chopped, 2), label="up")
plt = plot!(stretch(chopped, 4), label="stretch")

display(plt)

while true
end
