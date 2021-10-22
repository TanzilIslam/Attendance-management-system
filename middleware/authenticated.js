import cookieparser from "cookieparser";
export default function(context) {
  const user = /\/dashboard\/*/g;
  const admin = /\/admin\/*/g;
  if (context.route.path.match(user) || context.route.path.match(admin) ) {
    try {
      const parsed = cookieparser.parse(context.req.headers.cookie);
      if (parsed.role !== "user" && context.route.path.match(user)) {
        context.redirect("/");
      } else if (parsed.role !== "admin" && context.route.path.match(admin)) {
        context.redirect("/");
      }
    } catch (error) {
      context.redirect("/");
    }
  }
}
