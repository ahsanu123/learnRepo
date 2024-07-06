using Plots

f(x) = 2^x
function fx(x)
  return 2^x
end

xs = range(0, 2, length=50)
ys = f.(xs)

plot(xs, ys)
plt = plot!(ys, xs, label="inverse")

display(plt)

while true
end
