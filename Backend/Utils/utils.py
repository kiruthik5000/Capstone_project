import random

def generate_ip() -> str:
    """
    Generates a random IPv4 address.
    """
    return ".".join(str(random.randint(0, 255)) for _ in range(4))

if __name__ == '__main__':
    print(f"Generated IP: {generate_ip()}")