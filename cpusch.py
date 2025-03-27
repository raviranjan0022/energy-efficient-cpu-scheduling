class CPU:
    def __init__(self, name, domain, base_power, max_freq):
        self.name = name
        self.domain = domain
        self.base_power = base_power
        self.max_freq = max_freq
        self.current_freq = max_freq
        self.utilization = 0
        self.tasks = []

    def calculate_energy(self, task):
        # Energy Model: Predict energy consumption based on utilization and task characteristics
        freq_ratio = self.current_freq / self.max_freq
        utilization = min(1.0, self.utilization + task.estimated_utilization)
        return self.base_power * freq_ratio * utilization

    def adjust_frequency(self, target_utilization):
        # Dynamic Voltage Scaling
        self.current_freq = min(self.max_freq, 
                              max(self.max_freq * 0.1, 
                                  self.max_freq * target_utilization))

class EnergyEfficientScheduler:
    def __init__(self, cpus):
        self.tasks = []
        self.cpus = cpus
        self.profiling_data = {}

    def add_task(self, task):
        self.tasks.append(task)

    def profile_task(self, task):
        # Monitoring and Profiling
        if task.name not in self.profiling_data:
            self.profiling_data[task.name] = {
                'avg_utilization': task.estimated_utilization,
                'execution_count': 1
            }
        else:
            profile = self.profiling_data[task.name]
            profile['avg_utilization'] = (
                (profile['avg_utilization'] * profile['execution_count'] + 
                 task.estimated_utilization) / 
                (profile['execution_count'] + 1)
            )
            profile['execution_count'] += 1

    def find_optimal_cpu(self, task):
        # Task Placement Algorithm with Performance Domain Awareness
        min_energy = float('inf')
        selected_cpu = None
        
        for cpu in self.cpus:
            if cpu.utilization + task.estimated_utilization <= 1.0:
                energy = cpu.calculate_energy(task)
                if energy < min_energy:
                    min_energy = energy
                    selected_cpu = cpu
        
        return selected_cpu

    def schedule_tasks(self):
        # Adaptive Scheduling Policies
        for task in self.tasks:
            self.profile_task(task)
            cpu = self.find_optimal_cpu(task)
            if cpu:
                cpu.tasks.append(task)
                cpu.utilization += task.estimated_utilization
                cpu.adjust_frequency(cpu.utilization)
                self.execute_task(task, cpu)
            else:
                print(f"No suitable CPU found for task {task.name}")

    def execute_task(self, task, cpu):
        print(f"Executing {task.name} on {cpu.name} (Domain: {cpu.domain})")
        print(f"CPU Frequency: {cpu.current_freq:.2f} GHz")
        print(f"Estimated Energy: {cpu.calculate_energy(task):.2f} W\n")

class Task:
    def __init__(self, name, estimated_utilization, deadline=None):
        self.name = name
        self.estimated_utilization = estimated_utilization
        self.deadline = deadline

# Example usage
cpus = [
    CPU("BigCore1", "performance", 10.0, 3.0),
    CPU("BigCore2", "performance", 10.0, 3.0),
    CPU("LittleCore1", "efficiency", 2.0, 1.5),
    CPU("LittleCore2", "efficiency", 2.0, 1.5)
]

scheduler = EnergyEfficientScheduler(cpus)
scheduler.add_task(Task("Task1", 0.3))
scheduler.add_task(Task("Task2", 0.5))
scheduler.add_task(Task("Task3", 0.2))
scheduler.add_task(Task("Task4", 0.8))
scheduler.schedule_tasks()
