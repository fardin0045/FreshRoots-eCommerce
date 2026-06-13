import {
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Delivered within 60 minutes in selected areas",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Guaranteed genuine products from trusted brands",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer assistance whenever you need",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Pay safely with cards, mobile banking & cash",
  },
];

const Features = () => {
  return (
    <section className="bg-gradient-to-b from-white to-green-50 py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="
                  group
                  bg-white
                  rounded-3xl
                  p-6
                  shadow-sm
                  border
                  border-gray-100
                  hover:shadow-xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-green-100
                    flex
                    items-center
                    justify-center
                    mb-5
                    group-hover:bg-green-600
                    transition-all
                  "
                >
                  <Icon
                    size={30}
                    className="
                      text-green-600
                      group-hover:text-white
                      transition-all
                    "
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;