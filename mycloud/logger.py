import logging

# Function to setup logging
def setup_logger(name, level=logging.DEBUG):
    try:
        logger = logging.getLogger(name)
        logger.setLevel(level)

        console_handler = logging.StreamHandler()
        console_handler.setLevel(level)

        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)

        logger.addHandler(console_handler)

        return logger
    except Exception as e:
        print(f"Error setting up logger: {e}")
        return None
