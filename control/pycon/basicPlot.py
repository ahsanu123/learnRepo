import control as ct
import matplotlib.pyplot as plt

sys_mimo = ct.tf2ss(
    [[[1], [0.1]], [[0.2], [1]]],
    [[[1, 0.6, 1], [1, 1, 1]], [[1, 0.4, 1], [1, 2, 1]]],
    name="sys_mimo",
)
response = ct.step_response(sys_mimo)
response.plot()
plt.show()
