def filter_paths(endpoints):
    filtered = []
    for (path, path_regex, method, callback) in endpoints:
        if "schema" not in path:
            filtered.append((path, path_regex, method, callback))
    return filtered